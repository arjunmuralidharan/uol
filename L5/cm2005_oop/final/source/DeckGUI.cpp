/*
  ==============================================================================

    DeckGUI.cpp
    Created: 13 Mar 2020 6:44:48pm
    Author:  matthew

  ==============================================================================
*/

#include "DeckGUI.h"

#include "../JuceLibraryCode/JuceHeader.h"

//==============================================================================
DeckGUI::DeckGUI(DJAudioPlayer* _player,
				 AudioFormatManager& formatManagerToUse,
				 AudioThumbnailCache& cacheToUse) : waveformDisplay(formatManagerToUse, cacheToUse),
													player(_player)

{
	// Create the buttons
	addAndMakeVisible(playButton);
	addAndMakeVisible(stopButton);
	addAndMakeVisible(loadButton);
	addAndMakeVisible(reverbButton);

	// Create the sliders
	addAndMakeVisible(volSlider);
	addAndMakeVisible(speedSlider);
	addAndMakeVisible(posSlider);

	// Create the wave form display
	addAndMakeVisible(waveformDisplay);

	// Add button and slider listeners
	playButton.addListener(this);
	stopButton.addListener(this);
	loadButton.addListener(this);
	reverbButton.addListener(this);
	volSlider.addListener(this);
	speedSlider.addListener(this);
	posSlider.addListener(this);

	// Set suitable ranges for the sliders
	// Volume: From 0% to 100%
	// Speed: From 0.5x to 2x speed
	// Position: From 0 % to 100 %
	volSlider.setRange(0.0, 1.0);
	speedSlider.setRange(0.5, 2.0);
	posSlider.setRange(0.0, 1.0);

	// Start a timer so that timerCallback() will be called every 500ms.
	startTimer(500);
}

DeckGUI::~DeckGUI()
{
	stopTimer();
}

void DeckGUI::paint(Graphics& g)
{
	// Draw the basic outline and colours for the deck
	g.fillAll(getLookAndFeel().findColour(ResizableWindow::backgroundColourId));

	g.setColour(Colours::grey);
	g.drawRect(getLocalBounds(), 1);

	g.setColour(Colours::white);
	g.setFont(14.0f);
}

void DeckGUI::resized()
{
	// Position all the GUI elements of the deck
	double rowH = getHeight() / 9;
	playButton.setBounds(0, 0, getWidth(), rowH);
	stopButton.setBounds(0, rowH, getWidth(), rowH);
	reverbButton.setBounds(0, rowH * 2, getWidth(), rowH);
	volSlider.setBounds(0, rowH * 3, getWidth(), rowH);
	speedSlider.setBounds(0, rowH * 4, getWidth(), rowH);
	posSlider.setBounds(0, rowH * 5, getWidth(), rowH);
	waveformDisplay.setBounds(0, rowH * 6, getWidth(), rowH * 2);
	loadButton.setBounds(0, rowH * 8, getWidth(), rowH);
}

void DeckGUI::buttonClicked(Button* button)
{
	// Start playing a track
	if (button == &playButton)
	{
		player->start();
	}

	// Stop playing a track
	if (button == &stopButton)
	{
		player->stop();
	}

	// Load a track into the deck
	if (button == &loadButton)
	{
		// Brings up an OS file dialog to select a file, and loads it into the player and wave form display
		FileChooser chooser{"Select a file..."};
		if (chooser.browseForFileToOpen())
		{
			player->loadURL(URL{chooser.getResult()});
			waveformDisplay.loadURL(URL{chooser.getResult()});
		}
	}

	// Toggle the reverb audio effect
	if (button == &reverbButton)
	{
		player->toggleReverb();
		reverbButton.toggle = !reverbButton.toggle;
	}
}

void DeckGUI::sliderValueChanged(Slider* slider)
{
	// Set the volumne/gain of the track
	if (slider == &volSlider && slider->getValue() > 0)
	{
		player->setGain(slider->getValue());
	}

	// Set the playback speed of the track
	if (slider == &speedSlider && slider->getValue() > 0)
	{
		player->setSpeed(slider->getValue());
	}

	// Set the playhead position
	if (slider == &posSlider && slider->getValue() > 0)
	{
		player->setPositionRelative(slider->getValue());
	}
}

bool DeckGUI::isInterestedInFileDrag(const StringArray& files)
{
	// The entire deck responds to file drops at any time
	return true;
}

void DeckGUI::filesDropped(const StringArray& files, int x, int y)
{
	// The deck accepts only one file at a time via drag and drop
	std::cout << "DeckGUI::filesDropped" << std::endl;
	if (files.size() == 1)
	{
		player->loadURL(URL{File{files[0]}});
		waveformDisplay.loadURL(URL{File{files[0]}});
	}
}

void DeckGUI::timerCallback()
{
	// Adjust the playhead of the waverform periodically
	waveformDisplay.setPositionRelative(
		player->getPositionRelative());
}

void DeckGUI::loadURL(const URL& url)
{
	// Load a file path into the player and waverform respectively
	player->loadURL(url);
	waveformDisplay.loadURL(url);
}
