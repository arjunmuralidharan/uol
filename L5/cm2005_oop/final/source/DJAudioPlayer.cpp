/*
==============================================================================

DJAudioPlayer.cpp
Created: 13 Mar 2020 4:22:22pm
Author:  matthew

==============================================================================
*/

#include "DJAudioPlayer.h"

DJAudioPlayer::DJAudioPlayer(AudioFormatManager& _formatManager)
	: formatManager(_formatManager)
{
}
DJAudioPlayer::~DJAudioPlayer()
{
}

void DJAudioPlayer::prepareToPlay(int samplesPerBlockExpected, double sampleRate)
{
	// Prepare the various audio transport sources for the effects applied
	transportSource.prepareToPlay(samplesPerBlockExpected, sampleRate);
	resampleSource.prepareToPlay(samplesPerBlockExpected, sampleRate);
	reverbSource.prepareToPlay(samplesPerBlockExpected, sampleRate);
}
void DJAudioPlayer::getNextAudioBlock(const AudioSourceChannelInfo& bufferToFill)
{
	// Switch to the reverb source if reverb is active
	if (reverb == true)
	{
		reverbSource.getNextAudioBlock(bufferToFill);
	}
	// Otherwise use the regular resample source
	else
	{
		resampleSource.getNextAudioBlock(bufferToFill);
	}
}
void DJAudioPlayer::releaseResources()
{
	// Release all audio transport sources
	transportSource.releaseResources();
	resampleSource.releaseResources();
	reverbSource.releaseResources();
}

void DJAudioPlayer::loadURL(URL audioURL)
{
	// Create an input stream reader to load in an audio file
	auto* reader = formatManager.createReaderFor(audioURL.createInputStream(false));
	if (reader != nullptr)	// good file!
	{
		std::unique_ptr<AudioFormatReaderSource> newSource(new AudioFormatReaderSource(reader,
																					   true));
		// Apply the audio source to the transport source
		transportSource.setSource(newSource.get(), 0, nullptr, reader->sampleRate);
		readerSource.reset(newSource.release());
	}
}
void DJAudioPlayer::setGain(double gain)
{
	if (gain < 0 || gain > 1.0)
	{
		std::cout << "DJAudioPlayer::setGain gain should be between 0 and 1" << std::endl;
	}
	else
	{
		transportSource.setGain(gain);
	}
}
void DJAudioPlayer::setSpeed(double ratio)
{
	if (ratio < 0 || ratio > 100.0)
	{
		std::cout << "DJAudioPlayer::setSpeed ratio should be between 0 and 100" << std::endl;
	}
	else
	{
		resampleSource.setResamplingRatio(ratio);
	}
}
void DJAudioPlayer::setPosition(double posInSecs)
{
	transportSource.setPosition(posInSecs);
}

void DJAudioPlayer::setPositionRelative(double pos)
{
	if (pos < 0 || pos > 1.0)
	{
		std::cout << "DJAudioPlayer::setPositionRelative pos should be between 0 and 1" << std::endl;
	}
	else
	{
		// Calculate the absolute position in the track based on % input
		double posInSecs = transportSource.getLengthInSeconds() * pos;
		setPosition(posInSecs);
	}
}

void DJAudioPlayer::start()
{
	transportSource.start();
}
void DJAudioPlayer::stop()
{
	transportSource.stop();
}

double DJAudioPlayer::getPositionRelative()
{
	// Calculate the % of the track played at the current time stamp
	return transportSource.getCurrentPosition() / transportSource.getLengthInSeconds();
}

void DJAudioPlayer::toggleReverb()
{
	// Toggle the reverb state between true and false
	reverb = !reverb;
}
