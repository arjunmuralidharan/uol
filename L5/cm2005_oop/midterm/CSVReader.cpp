#include "CSVReader.hpp"

#include "OrderBookEntry.hpp"

CSVReader::CSVReader()
{
}

std::map<std::string, std::vector<OrderBookEntry>> CSVReader::readCSV(std::string csvFileName)
{
	std::map<std::string, std::vector<OrderBookEntry>> entries;
	std::ifstream csvFile{csvFileName};

	if (csvFile.is_open())
	{
		std::string line;
		while (std::getline(csvFile, line))
		{
			OrderBookEntry obe{stringsToOBE(tokenise(line, ','))};
			entries[obe.timestamp].push_back(obe);
		}
	}
	else
	{
		std::cout << "Problem opening file " << csvFileName << std::endl;
	}
	csvFile.close();
	return entries;
}

std::vector<std::string> CSVReader::tokenise(std::string csvLine, char separator)
{
	std::vector<std::string> tokens;
	int start, end;
	std::string token;
	start = csvLine.find_first_not_of(separator, 0);
	do
	{
		end = csvLine.find_first_of(separator, start);
		if (start == csvLine.length() || start == end)
			break;
		if (end >= 0)
			token = csvLine.substr(start, end - start);
		else
			token = csvLine.substr(start, csvLine.length() - start);
		tokens.push_back(token);
		start = end + 1;
	} while (end > 0);

	return tokens;
}

OrderBookEntry CSVReader::stringsToOBE(std::vector<std::string> tokens)
{
	double price, amount;
	if (tokens.size() != 5)
	{
		std::cout << "Bad line" << std::endl;
		throw std::exception{};
	}

	try
	{
		price = std::stod(tokens[3]);
		amount = std::stod(tokens[4]);
	}
	catch (const std::exception& e)
	{
		std::cout << "Bad float! " << tokens[3] << std::endl;
		std::cout << "Bad float! " << tokens[4] << std::endl;
		throw;
	}

	OrderBookEntry obe{
		price,
		amount,
		tokens[0],
		tokens[1],
		OrderBookEntry::stringToOrderBookType(tokens[2])};

	return obe;
}

OrderBookEntry CSVReader::stringsToOBE(std::string priceString,
									   std::string amountString,
									   std::string timestamp,
									   std::string product,
									   OrderBookType orderType, std::string username)
{
	double price, amount;
	try
	{
		price = std::stod(priceString);
		amount = std::stod(amountString);
	}
	catch (const std::exception& e)
	{
		std::cout << "CSVReader::stringsToOBE Bad float! " << priceString << std::endl;
		std::cout << "CSVReader::stringsToOBE Bad float! " << amountString << std::endl;
		throw;	// throw up to the calling function
	}

	OrderBookEntry obe{price,
					   amount,
					   timestamp,
					   product,
					   orderType,
					   username};
	return obe;
}
