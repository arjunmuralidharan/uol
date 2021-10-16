/*
  ==============================================================================

    CustomDeckControl.h
    Created: 17 Sep 2020 9:48:38pm
    Author:  Arjun Muralidharan

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>

//==============================================================================
/*
*/
class CustomDeckControl : public TextButton
{
public:
	/** @constructor */
	CustomDeckControl(const std::string& buttonName);

	/** @descructor */
	~CustomDeckControl() override;

	/**
    * Paint the button on screen
    * @param {Graphics} g - the graphics context to draw the button
    * @param {bool} shouldDrawButtonAsHighlighted - set to true if the button is hovered on
    * @param {bool} shouldDrawButtonAsDown - set to true if the button is pressed
    * @returns {void} - only results in the painted button
    */
	void paintButton(Graphics& g,
					 bool shouldDrawButtonAsHighlighted,
					 bool shouldDrawButtonAsDown) override;

	/** Control the positioning and bounds of elements on screen when resized */
	void resized() override;

	/**
     * Store the toggle state of this button
     * @var {bool} toggle
     */
	bool toggle{false};

private:
	std::string buttonLabel{};	// Label for this custom button component
	JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(CustomDeckControl)
};
