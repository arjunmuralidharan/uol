/*
  ==============================================================================

    DeckGUI.h
    Created: 13 Mar 2020 6:44:48pm
    Author:  matthew

  ==============================================================================
*/

#pragma once

#include "../JuceLibraryCode/JuceHeader.h"
#include "CustomDeckControl.h"
#include "DJAudioPlayer.h"
#include "WaveformDisplay.h"

//==============================================================================
/*
*/
class DeckGUI : public Component,
				public Button::Listener,
				public Slider::Listener,
				public FileDragAndDropTarget,
				public Timer
{
public:
	/**
	 * @constructor
	 * @param {DJAudioPlayer*} player - DeckGUI needs a player object to output its sound to
	 * @param {AudioFormatManager} formatManagerToUse - Provides the format manager for the Wave Form Display
	 * @param {AudioThumbnailCache} cacheToUse - Provides the thumbnail cache of the audio file for the Wave Form Display
	*/
	DeckGUI(DJAudioPlayer *player,
			AudioFormatManager &formatManagerToUse,
			AudioThumbnailCache &cacheToUse);
	~DeckGUI();

	/**
    * Paint the Deck on screen
    * @param {Graphics} g - the graphics context to draw the Deck
    * @returns {void} - only results in the painted Deck
    */
	void paint(Graphics &) override;

	/** 
	 * Control the positioning and bounds of elements on screen when resized
	*/
	void resized() override;

	/**
     * Handle button click events
     * @param {Button*} button - A pointer to the button that is firing the event
     * @returns {void} - Results in different procedures executed depending on which button fired the event
     */
	void buttonClicked(Button *) override;

	/**
     * Handle slider change events
     * @param {Slider*} slider - A pointer to the slider that is firing the event
     * @returns {void} - Results in different procedures executed depending on which slider fired the event
     */
	void sliderValueChanged(Slider *slider) override;

	/**
     * Define logic for accepting file drops onto the component
     * @param {StringArray&} files - An array of strings, each containing the path to a music file
     * @return {bool} - We've set the entire component to accept file drops, with no restrictions. Always returns true.
     */
	bool isInterestedInFileDrag(const StringArray &files) override;

	/**
     * Capture dropped files
     * @param {StringArray} files - An array of strings, each containing the path to a music file
     * @param {int} x, y - The position of the file drop
     * @returns {void} - Results in files being available to process
     */
	void filesDropped(const StringArray &files, int x, int y) override;

	/**
 	* Periodically update the wave form display with the current playhead position
 	*/
	void timerCallback() override;

	/**
 	* Load a file path into the audio player. This is used when files are dropped onto the Ddeck directly.
	* @param {URL} url - A file path to an audio file to load 
 	*/
	void loadURL(const URL &url);

private:
	// @member Textbuttons to control playback
	TextButton playButton{"PLAY"};
	TextButton stopButton{"STOP"};
	TextButton loadButton{"LOAD"};
	CustomDeckControl reverbButton{"REVERB"};

	// @member Sliders to control playback
	Slider volSlider;
	Slider speedSlider;
	Slider posSlider;

	// @member Instantiate the wave form display
	WaveformDisplay waveformDisplay;

	// @member Instantiate the music player
	DJAudioPlayer *player;

	JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(DeckGUI)
};
