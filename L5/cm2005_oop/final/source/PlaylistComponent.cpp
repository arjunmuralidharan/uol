/*
  ==============================================================================

    PlaylistComponent.cpp
    Created: 16 Sep 2020 6:46:54pm
    Author:  Arjun Muralidharan

  ==============================================================================
*/

#include "PlaylistComponent.h"

#include <JuceHeader.h>

//==============================================================================
PlaylistComponent::PlaylistComponent(DeckGUI *_deck1, DeckGUI *_deck2) : deck1(_deck1), deck2(_deck2)
{
	// Create the music library table with column headers for track title and length
	// Two additional columns without a title will later display the buttons to add the track to the left and right deck
	tableComponent.getHeader().addColumn("Track Title", 1, 200);
	tableComponent.getHeader().addColumn("Track Length", 2, 200);
	tableComponent.getHeader().addColumn("", 3, 200);
	tableComponent.getHeader().addColumn("", 4, 200);
	tableComponent.setModel(this);

	// Make the music library table and search box visible
	addAndMakeVisible(tableComponent);
	addAndMakeVisible(searchTitle);
	addAndMakeVisible(searchInput);
	searchTitle.setText("Search (Hit Enter)", juce::dontSendNotification);
	searchTitle.attachToComponent(&searchInput, true);
	searchTitle.setJustificationType(juce::Justification::verticallyCentred);
	searchInput.setEditable(true);
	searchInput.setColour(juce::Label::backgroundColourId, juce::Colours::darkblue);

	// Lambda function to handle text inputs into the search box
	searchInput.onTextChange = [this] { searchLibraryFor(searchInput.getText()); };

	// Register formats with the AudioFormatManager for the purpose of then reading the time length of audio files
	formatManager.registerBasicFormats();

	// Load the existing library file, if available
	if (library.existsAsFile())
	{
		FileInputStream libStream(library);
        trackTitles.clear();
        while (!libStream.isExhausted())
		{
			String currentTrack = libStream.readNextLine();
			trackTitles.push_back(currentTrack);
			trackLengths.push_back(getLengthOfTrack(currentTrack));
			tableComponent.updateContent();
		}
	}
}

PlaylistComponent::~PlaylistComponent()
{
}

void PlaylistComponent::paint(juce::Graphics &g)
{
	// Draw the basic outline and colours for the music library
	g.fillAll(getLookAndFeel().findColour(juce::ResizableWindow::backgroundColourId));
	g.setColour(juce::Colours::grey);
	g.drawRect(getLocalBounds(), 1);
	g.setColour(juce::Colours::white);
	g.setFont(14.0f);
}

void PlaylistComponent::resized()
{
	// Position the table that displays the music library
	tableComponent.setBounds(0, 0, getWidth(), getHeight() * 0.8);

	// Position the search box (title and input field)
	searchInput.setBounds(getWidth() * 0.1, getHeight() * 0.81, getWidth() * 0.8, getHeight() * 0.05);
}

int PlaylistComponent::getNumRows()
{
	return static_cast<int>(trackTitles.size());
}

void PlaylistComponent::paintRowBackground(Graphics &g,
										   int rowNumber,
										   int width,
										   int height,
										   bool rowIsSelected)
{
	if (rowIsSelected)
	{
		g.fillAll(Colours::orange);
	}
	else
	{
		g.fillAll(Colours::darkgrey);
	}

	// Colour the row if it is a matched search result
	if (searchResults.size() > 0 && searchResults[rowNumber] == true)
	{
		g.fillAll(Colours::red);
	}
}

void PlaylistComponent::paintCell(Graphics &g,
								  int rowNumber,
								  int columnId,
								  int width,
								  int height,
								  bool rowIsSelected)
{
	g.setColour(juce::Colours::white);

	// Insert the track titles into the first column of the library
	if (columnId == 1)
	{
		g.drawText(File{trackTitles[rowNumber]}.getFileName(),
				   2, 0,
				   width - 4, height,
				   Justification::centredLeft,
				   true);
	}

	// Insert the track length into the second column of the library
	if (columnId == 2)
	{
		g.drawText(trackLengths[rowNumber],
				   2, 0,
				   width - 4, height,
				   Justification::centredLeft,
				   true);
	}
}

Component *PlaylistComponent::refreshComponentForCell(int rowNumber,
													  int columnId,
													  bool isRowSelected,
													  Component *existingComponentToUpdate)
{
	// Place deck buttons for the left deck into the third column
	if (columnId == 3)
	{
		if (existingComponentToUpdate == nullptr)
		{
			TextButton *btn = new TextButton{"Left Deck"};
			String id{std::to_string(rowNumber)};
			btn->setComponentID(id);
			btn->setName("Left");
			btn->addListener(this);
			existingComponentToUpdate = btn;
		}
	}

	// Place deck buttons for the right deck into the third column
	if (columnId == 4)
	{
		if (existingComponentToUpdate == nullptr)
		{
			TextButton *btn = new TextButton{"Right Deck"};
			String id{std::to_string(rowNumber)};
			btn->setComponentID(id);
			btn->setName("Right");
			btn->addListener(this);
			existingComponentToUpdate = btn;
		}
	}
	return existingComponentToUpdate;
}

void PlaylistComponent::buttonClicked(Button *button)
{
	// Convert the buttons component ID to an integer, so we can use it as the index of our track titles array
	int id = std::stoi(button->getComponentID().toStdString());

	// If the left button was clicked, push the track to the left deck
	if (button->getName() == "Left")
	{
		deck1->loadURL(URL{File{trackTitles[id]}});
	}

	// If the right button was clicked, push the track to the left deck
	if (button->getName() == "Right")
	{
		deck2->loadURL(URL{File{trackTitles[id]}});
	}
}

bool PlaylistComponent::isInterestedInFileDrag(const StringArray &files) { return true; }

void PlaylistComponent::filesDropped(const StringArray &files, int x, int y)
{
	// Iterate over all dropped files and store the track titles and lengths into vectors
	for (String file : files)
	{
		trackTitles.push_back(file);
		trackLengths.push_back(getLengthOfTrack(file));
	}

	// Refresh the table to show the newly added files
	tableComponent.updateContent();

	// Store the music library to a text file on disk so we can retrieve it again
	// Create an output stream
	FileOutputStream libStream(library);
	// Write each loaded track to a new line in the library
	for (const String &trackTitle : trackTitles)
	{
		libStream << trackTitle << newLine;
	}
}

String PlaylistComponent::getLengthOfTrack(String file)
{
	auto duration{0};

	// Calculate the duration of the track by using an AudioFormatReader on the audio file
	std::unique_ptr<juce::AudioFormatReader> reader(formatManager.createReaderFor(File{file}));
	if (reader.get() != nullptr)
	{
		// Formula to calculate length based on sample size and sample rate
		duration = (float)reader->lengthInSamples / reader->sampleRate;
	}

	// Calculate minutes and seconds
	String minutes = std::to_string(duration / 60);
	String seconds = std::to_string(duration % 60);

	// If the track doesn't have any seconds beyond the full minute, we need to append another 0
	// Otherwise tracks that are e.g. 5 minutes long show up as "5:0" instead of "5:00".
	if (seconds == "0")
	{
		seconds = "00";
	}

	// Return the combined track length in MM:SS format
	return minutes + ":" + seconds;
}

void PlaylistComponent::searchLibraryFor(const String &searchTerm)
{
	searchResults.clear();

	// User needs to type at least two characters for the search to execute.
	// The search works by looking for a string in each element of the track titles vector.
	// We maintain a vector "searchResults" that is of equal length as track titles. If the track title matches our
	// search term, we mark our result vector as "true" in the same index position as the track title.
	// Later, we can check each track title against the results vector to decide how to show the user that a specific
	// track was a match (or not)
	if (searchTerm.length() > 1)
	{
		// Iterate over the track titles and look for the search term in each
		for (int i = 0; i < trackTitles.size(); ++i)
		{
			if (trackTitles[i].contains(searchTerm))
			{
				// Hit - mark this track as a result
				searchResults.push_back(true);
			}
			else
			{
				// Miss - mark this track as not a result
				searchResults.push_back(false);
			}
		}
	}

	// Refresh the library table so results are marked
	tableComponent.repaint();
}
