/*
  ==============================================================================

    DJAudioPlayer.h
    Created: 13 Mar 2020 4:22:22pm
    Author:  matthew

  ==============================================================================
*/

#pragma once

#include "../JuceLibraryCode/JuceHeader.h"

class DJAudioPlayer : public AudioSource
{
public:
	/**
	 * @constructor
	 * @param {AudioFormatManager} formatManagerToUse - Provides the format manager for audio playback
	*/
	DJAudioPlayer(AudioFormatManager& _formatManager);
	~DJAudioPlayer();

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

	/** Load a file path into the audio source 
	 * @param {URL} audioURL - a file path to an audio file
	*/
	void loadURL(URL audioURL);

	/** Set the gain/volume of the audio source
	 * @param {double} gain - the level of gain to be set, usually passed in by the slider control on the DeckGUI
	*/
	void setGain(double gain);

	/** Set the speed of the audio source
	 * @param {double} gain - the playback speedto be set, usually passed in by the slider control on the DeckGUI
	*/
	void setSpeed(double ratio);

	/** Set the position of playback to an absolute time value
	 * (e.g., set it to 00:12 of a track, assuming the track has at least 12 seconds of playback)
	 * @param {double} posInSecs - The time stamp to which the playhead should be set
	*/
	void setPosition(double posInSecs);

	/** Set the position of playback to a relative (%) time value
	 * (e.g., set it to 45% of the track's total length)
	 * @param {double} posInSecs - The percentage value of the track length to which the playhead should be set
	*/
	void setPositionRelative(double pos);

	/** Get the relative position of the playhead */
	double getPositionRelative();

	/** Start playback */
	void start();

	/** Stop playback */
	void stop();

	/** Apply the reverb effect */
	void toggleReverb();

private:
	/** 
	 * @var {bool} - tracks the state of whether reverb should be applied or not
	*/
	bool reverb{false};

	// Various JUCE audio objects that layer and manage the audio playback
	// See JUCE AudioAppComponent Class Reference
	AudioFormatManager& formatManager;
	std::unique_ptr<AudioFormatReaderSource> readerSource;
	AudioTransportSource transportSource;
	ResamplingAudioSource resampleSource{&transportSource, false, 2};
	ReverbAudioSource reverbSource{&resampleSource, false};
};
