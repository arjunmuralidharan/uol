#ifndef MERKLEMAIN_H
#define MERKLEMAIN_H

#include "MerkleBot.hpp"
#include "OrderBook.hpp"
#include "OrderBookEntry.hpp"
#include "Wallet.hpp"

class MerkleMain
{
public:
	// Constructor
	MerkleMain();

	/** Call this to start the simulation */
	void init();

private:
	static void printMenu();
	static void printHelp();
	void printMarketStats();
	void enterAsk();
	void enterBid();
	void printWallet();
	void gotoNextTimeframe();
	void runBot();
	static int getUserOption();
	void processUserOption(int userOption);

	std::string currentTime;
	OrderBook orderBook{"20200601.csv"};
	Wallet wallet;
};

#endif
