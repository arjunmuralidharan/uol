#ifndef CSVREADER_H
#define CSVREADER_H

#include <fstream>
#include <iostream>
#include <map>
#include <string>
#include <vector>

#include "OrderBookEntry.hpp"

class CSVReader
{
public:
	// Constructor
	CSVReader();

	/** Read a CSV file and return a map of the order book */
	static std::map<std::string, std::vector<OrderBookEntry>> readCSV(std::string csvFileName);

	/** Tokenize a string into a vector of tokens */
	static std::vector<std::string> tokenise(std::string csvLine, char separator);

private:
	static OrderBookEntry stringsToOBE(std::vector<std::string> strings);
	static OrderBookEntry stringsToOBE(std::string price,
									   std::string amount,
									   std::string timestamp,
									   std::string product,
									   OrderBookType OrderBookType,
									   std::string username);
};

#endif
