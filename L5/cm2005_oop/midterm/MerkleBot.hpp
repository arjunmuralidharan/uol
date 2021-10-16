#ifndef MERKLEBOT_H
#define MERKLEBOT_H

#include <fstream>
#include <iostream>
#include <map>
#include <string>
#include <vector>

#include "OrderBook.hpp"
#include "Wallet.hpp"

class MerkleBot
{
public:
	// R1A: Bot accesses orderbook
	/** Constructor accesses the order book from the main application*/
	MerkleBot(Wallet& _wallet, OrderBook& _orderBook, std::string& _currentTime);
	Wallet& wallet;
	OrderBook& orderBook;
	std::string& currentTime;

	// R2A: Bot can generate bids and place them in the order book
	/** Create a bid for the specified price, amount and product */
	void createBid(double price, double amount, std::string product);

	// R2B: Bot can generate asks and place them in the order book
	/** Create a bid for the specified price, amount and product */
	void createAsk(double price, double amount, std::string product);

	// R2C: Bot updates wallet after successful sales
	/** Run the automated simulation for the remainder of the order book */
	void trade();

	/** Execute all pending trades in the order book */
	void executeTrades();

private:
	/* R1B: Bot can generate predictions of future market prices */
	/** Get a list of currencies that should be bought based on the current timeframe */
	std::map<OrderBookType, std::map<std::string, double>> stockPicks();

	/** Calculate a simple moving average for a specific product and type, and number of timeframes in the past */
	double simpleMovingAverage(const std::string& product, const int& timeframes, const OrderBookType& type);

	// R3A: Bot generates a log of the contents of its wallet
	/** Generate a text log file with the wallet contents */
	void generateWalletLog();

	// R3B: Bot generates a log of its bids and asks
	// R3C: Bot generates a log of its sales
	/** Generate a log file entry for a given order */
	void generateBidsAsksSalesLog(const OrderBookEntry& order);
};

#endif
