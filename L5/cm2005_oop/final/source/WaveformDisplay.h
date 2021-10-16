/*
  ==============================================================================

    WaveformDisplay.h
    Created: 14 Mar 2020 3:50:16pm
    Author:  matthew

  ==============================================================================
*/

#pragma once

#include "../JuceLibraryCode/JuceHeader.h"

//==============================================================================
/*
*/
class WaveformDisplay : public Component,
						public ChangeListener
{
public:
	/**
	 * @constructor
	 * @param {AudioFormatManager} formatManagerToUse - Provides the format manager for audio playback
	 * @param {AudioThumbnailCache} cacheToUse - Provides an audio thumbnail cache that can be used to draw the waverform
	*/
	WaveformDisplay(AudioFormatManager &formatManagerToUse,
					AudioThumbnailCache &cacheToUse);
	~WaveformDisplay();

	/**
    * Paint the Wave Form on screen
    * @param {Graphics} g - the graphics context to draw the Wave Form
    * @returns {void} - only results in the painted Wave Form
    */
	void paint(Graphics &) override;

	/** 
	 * Control the positioning and bounds of elements on screen when resized
	*/
	void resized() override;

	/** 
	 * Update the playhead when the audio thumbnail changes
	 * @param {ChangeBroadcaster} source - any object that gets a listener attached can be passed in. In our case it's the Audio Thumbnail.
	*/
	void changeListenerCallback(ChangeBroadcaster *source) override;

	/**
 	* Load a file path into the audio player. This is used when files are dropped onto the Ddeck directly.
	* @param {URL} url - A file path to an audio file to load 
 	*/
	void loadURL(URL audioURL);

	/** Set the position of playback to a relative (%) time value
	 * (e.g., set it to 45% of the track's total length)
	 * @param {double} posInSecs - The percentage value of the track length to which the playhead should be set
	*/
	void setPositionRelative(double pos);

private:
	/** 
	* @member - The audio thumbnail used to draw the wave form
	*/
	AudioThumbnail audioThumb;

	/**
	 * @var - tracks if a file has been loaded into the wave form or not
	*/
	bool fileLoaded;

	/** 
	 * @var - track the position of the playhead
	*/
	double position;

	JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(WaveformDisplay)
};
