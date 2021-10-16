/*
  ==============================================================================

    WaveformDisplay.cpp
    Created: 14 Mar 2020 3:50:16pm
    Author:  matthew

  ==============================================================================
*/

#include "WaveformDisplay.h"

#include "../JuceLibraryCode/JuceHeader.h"

//==============================================================================
WaveformDisplay::WaveformDisplay(AudioFormatManager& formatManagerToUse,
								 AudioThumbnailCache& cacheToUse) : audioThumb(1000, formatManagerToUse, cacheToUse),
																	fileLoaded(false),
																	position(0)

{
	// Add listener to the audio thumb so we know when we need to update the playhead display
	audioThumb.addChangeListener(this);
}

WaveformDisplay::~WaveformDisplay()
{
}

void WaveformDisplay::paint(Graphics& g)
{
	// Draw the basic outline and colours for the wave form display
	g.fillAll(getLookAndFeel().findColour(ResizableWindow::backgroundColourId));  // clear the background

	g.setColour(Colours::grey);
	g.drawRect(getLocalBounds(), 1);  // draw an outline around the component

	g.setColour(Colours::orange);

	// Draw a playhead onto the wave form, if a file is loaded
	if (fileLoaded)
	{
		// Draw the wave form
		audioThumb.drawChannel(g,
							   getLocalBounds(),
							   0,
							   audioThumb.getTotalLength(),
							   0,
							   1.0f);
		g.setColour(Colours::lightgreen);

		// Draw the playhead
		g.drawRect(position * getWidth(), 0, getWidth() / 20, getHeight());
	}
	else
	// Remind the user to load a track
	{
		g.setFont(20.0f);
		g.drawText("Load a track...", getLocalBounds(),
				   Justification::centred, true);  // draw some placeholder text
	}
}

void WaveformDisplay::resized()
{
}

void WaveformDisplay::loadURL(URL audioURL)
{
	// Load a new file into the audio thumbnail
	audioThumb.clear();
	fileLoaded = audioThumb.setSource(new URLInputSource(audioURL));

	// Redraw the waveform if a new file is loaded in
	if (fileLoaded)
	{
		repaint();
	}
}

void WaveformDisplay::changeListenerCallback(ChangeBroadcaster* source)
{
	// Redraw the waveform if the audio thumbnail changes - used to update the playhead
	repaint();
}

void WaveformDisplay::setPositionRelative(double pos)
{
	if (pos != position && pos == pos)
	{
		// Set the position in % where the playhead should be
		position = pos;
		repaint();
	}
}
