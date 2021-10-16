/*
  ==============================================================================

    This file was auto-generated!

  ==============================================================================
*/

#pragma once

#include "../JuceLibraryCode/JuceHeader.h"
#include "DJAudioPlayer.h"
#include "DeckGUI.h"
#include "PlaylistComponent.h"

//==============================================================================
/*
    This component lives inside our window, and this is where you should put all
    your controls and content.
*/
class MainComponent : public AudioAppComponent
{
public:
	//==============================================================================

	/** 
	 * @constructor
	*/
	MainComponent();
	~MainComponent();

	//==============================================================================
	/** Prepares the audio buffer for playback 
	 * @param {int} samplesPerBlockExpected - the number of samples in each audio buffer block
	 * @param {double} sampleRate - the sample rate, set at a standard 44.1KHz by JUCE
	*/
	void prepareToPlay(int samplesPerBlockExpected, double sampleRate) override;

	/** Play the next audio block
	 * @param {AudioSourceChannelInfo} bufferToFill - the next audio block in the buffer
	*/
	void getNextAudioBlock(const AudioSourceChannelInfo& bufferToFill) override;

	/** Release the audio resources once playback is done */
	void releaseResources() override;

	//==============================================================================

	/**
    * Paint the Deck on screen
    * @param {Graphics} g - the graphics context to draw the Deck
    * @returns {void} - only results in the painted Deck
    */
	void paint(Graphics& g) override;

	/** 
	 * Control the positioning and bounds of elements on screen when resized
	*/
	void resized() override;

private:
	//==============================================================================

	/**
 	* @member - the AudioFormatManager that provides and manages audio formats
 	*/
	AudioFormatManager formatManager;

	/**
 	* @member - the AudioThumbnailCache used for the wave form display
 	*/
	AudioThumbnailCache thumbCache{100};

	/**
 	* @member - The Audio Player and Deck GUI for the left deck
 	*/
	DJAudioPlayer player1{formatManager};
	DeckGUI deckGUI1{&player1, formatManager, thumbCache};

	/**
 	* @member - The Audio Player and Deck GUI for the right deck
 	*/
	DJAudioPlayer player2{formatManager};
	DeckGUI deckGUI2{&player2, formatManager, thumbCache};

	/**
 	* @member - The Mixer Sources to mix down both decks' audio
 	*/
	MixerAudioSource mixerSource;

	/**
 	* @member - The music library
 	*/
	PlaylistComponent playlistComponent{&deckGUI1, &deckGUI2};

	JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(MainComponent)
};
