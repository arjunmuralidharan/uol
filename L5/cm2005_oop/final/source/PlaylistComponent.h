/*
  ==============================================================================

    PlaylistComponent.h
    Created: 16 Sep 2020 6:46:54pm
    Author:  Arjun Muralidharan

  ==============================================================================
*/

#pragma once

#include <JuceHeader.h>

#include <vector>

#include "DeckGUI.h"

//==============================================================================
/*
*/
class PlaylistComponent : public Component,
						  public TableListBoxModel,
						  public Button::Listener,
						  public FileDragAndDropTarget
{
public:
	/**
     * @constructor
     */
	PlaylistComponent(DeckGUI *_deck1, DeckGUI *_deck2);
	~PlaylistComponent() override;

	void paint(juce::Graphics &) override;
	void resized() override;

	/**
     * Provide JUCE with a way to determine how many rows the music library has
     */
	int getNumRows() override;

	/**
     * Paint the table rows' background, mostly the colour and selected state when clicked
     * @param {Graphics} - the graphics context used to paint the table rows
     * @param {int} rowNumber - the number of the row currently being painted
     * @param {int} width - The width of the rows
     * @param {int} height - The height of the rows
     * @param {bool} rowIsSelected - evaluates to true if the current row being painted has been selected by the user
     * @returns {void} - only results in painted row background
     */
	void paintRowBackground(Graphics &,
							int rowNumber,
							int width,
							int height,
							bool rowIsSelected) override;

	/**
     * Paint the table cell contents
     * @param {Graphics} - the graphics context used to paint the table rows
     * @param {int} rowNumber - the number of the row currently being painted
     * @param {int} columnId - The column currently being painted, from left to right
     * @param {int} width - Width of the current cell
     * @param {bool} height - Height of the current cell
     * @param {bool} rowIsSelected - Evaluates to true if the current row of this cell is selected
     * @returns {void} - only results in painted cell
     */
	void paintCell(Graphics &,
				   int rowNumber,
				   int columnId,
				   int width,
				   int height,
				   bool rowIsSelected) override;

	/**
     * Update cells with custom components - in our case, buttons to play tracks on the two decks
     * @param {int} rowNumber - the number of the row currently being painted
     * @param {int} columnId - The column currently being painted, from left to right
     * @param {bool} rowIsSelected - Evaluates to true if the current row of this cell is selected
     * @param {Component*} existingComponentToUpdate - A pointer to the component that needs to be updated
     * @returns {void} - only results in painted cell
     */
	Component *refreshComponentForCell(int rowNumber,
									   int columnId,
									   bool isRowSelected,
									   Component *existingComponentToUpdate) override;

	/**
     * Handle button click events
     * @param {Button*} button - A pointer to the button that is firing the event
     * @returns {void} - Results in different procedures executed depending on which button fired the event
     */
	void buttonClicked(Button *button) override;

	/**
     * Define logic for accepting file drops onto the component
     * @param {StringArray&} files - An array of strings, each containing the path to a music file
     * @return {bool} - We've set the entire component to accept file drops, with no restrictions. Always returns true.
     */
	bool isInterestedInFileDrag(const StringArray &files) override;

	/**
     * Capture dropped files
     * @param {StringArray&} files - An array of strings, each containing the path to a music file
     * @param {int} x, y - The position of the file drop
     * @returns {void} - Results in files being available to process
     */
	void filesDropped(const StringArray &files, int x, int y) override;

private:
	TableListBox tableComponent;	   // The music library table
	std::vector<String> trackTitles;   // Vector storing the track titles
	std::vector<String> trackLengths;  // Vector storing the track lengths

	/**
     Get the length of a track in minutes and seconds, in the MM:SS format
     @param {String} file - Path to the file that we want to get the time length of
     @returns {String} - Time length of the audio file in MM:SS format.
    */
	String getLengthOfTrack(String file);

	// This is needed to read the audio files to get their lengt
	AudioFormatManager formatManager;

	// The two decks, their respective GUIs, so the playlist can push tracks to them
	// These are initialised through the constructor
	DeckGUI *deck1;
	DeckGUI *deck2;

	// Data members for the search functionality
	Label searchTitle;
	Label searchInput;

	/**
     Searches the music library for a specific search term
     * @param {String} searchTerm - the string the user has entered into the search box
     * @returns {void} - the search results are stored directly to the private data member "searchResults"
     */
	void searchLibraryFor(const String &searchTerm);
	std::vector<int> searchResults;

	// OS-agnostic path to store the music library as a text file on disk
	File library{File::getSpecialLocation(juce::File::userMusicDirectory).getFullPathName() + "/library.txt"};

	JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(PlaylistComponent)
};
