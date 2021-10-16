#include "MerkleMain.hpp"

#include <iostream>
#include <vector>

#include "CSVReader.hpp"
#include "OrderBook.hpp"
#include "OrderBookEntry.hpp"

MerkleMain::MerkleMain()
{
}

void MerkleMain::init()
{
	currentTime = orderBook.orders.begin()->first;
	short int input;
	wallet.insertCurrency("BTC", 10);
	wallet.insertCurrency("ETH", 100);
	wallet.insertCurrency("DOGE", 1000);

	// Clear any old log files
	if (std::filesystem::exists("bidsAsksLog.txt"))
	{
		remove("bidsAsksLog.txt");
	}

	if (std::filesystem::exists("walletLog.txt"))
	{
		remove("walletLog.txt");
	}

	if (std::filesystem::exists("sales.txt"))
	{
		remove("sales.txt");
	}

	while (true)
	{
		printMenu();
		input = getUserOption();
		processUserOption(input);
	}
}

void MerkleMain::printMenu()
{
	// 1 print help
	std::cout << "1: Print help" << std::endl;
	// 2 print exchange stats
	std::cout << "2: Print market stats" << std::endl;
	// 3 make an ask
	std::cout << "3: Make an ask" << std::endl;
	// 4 make a bid
	std::cout << "4: Make a bid" << std::endl;
	// 5 print wallet
	std::cout << "5: Print wallet" << std::endl;
	// 6 continue
	std::cout << "6: Continue" << std::endl;
	// 7 continue
	std::cout << "7: Enter Bot Mode" << std::endl;

	std::cout << "=============" << std::endl;
}

void MerkleMain::printHelp()
{
	std::cout << "Help - your aim is to make money. Analyse the market and make bids "
				 "and offers."
			  << std::endl;
}

void MerkleMain::printMarketStats()
{
	for (const std::string& p : orderBook.products)
	{
		std::cout << "Product: " << p << std::endl;
		std::vector<OrderBookEntry> entries = orderBook.getOrders(OrderBookType::ask, p, currentTime);
		std::cout << "Asks seen: " << entries.size() << std::endl;
		std::cout << "Max ask: " << OrderBook::getHighPrice(entries, p, OrderBookType::ask) << std::endl;
		std::cout << "Min ask: " << OrderBook::getLowPrice(entries, p, OrderBookType::ask) << std::endl;
		std::cout << "Earliest Time: " << currentTime << std::endl;
	}
}

void MerkleMain::enterAsk()
{
	std::cout << "Make an ask - enter an order: product,price,amount, e.g. ETH/BTC,200,0.5" << std::endl;
	std::string input;
	std::getline(std::cin, input);
	std::vector<std::string> tokens = CSVReader::tokenise(input, ',');
	if (tokens.size() == 3)
	{
		MerkleBot bot{wallet, orderBook, currentTime};
		double price, amount;
		price = std::stod(tokens[1]);
		amount = std::stod(tokens[2]);
		bot.createAsk(price, amount, tokens[0]);
		std::cout << "Ask successfully entered." << std::endl;
	}
	else
	{
		std::cout << "MerkelMain::enterAsk – Bad input" << std::endl;
	}
}

void MerkleMain::enterBid()
{
	std::cout << "Make a bid - enter an order: product,price,amount, e.g. ETH/BTC,200,0.5" << std::endl;
	std::string input;
	std::getline(std::cin, input);
	std::vector<std::string> tokens = CSVReader::tokenise(input, ',');

	if (tokens.size() == 3)
	{
		MerkleBot bot{wallet, orderBook, currentTime};
		double price, amount;
		price = std::stod(tokens[1]);
		amount = std::stod(tokens[2]);
		bot.createBid(price, amount, tokens[0]);
		std::cout << "Bid successfully entered." << std::endl;
	}
	else
	{
		std::cout << "MerkelMain::enterBid – Bad input" << std::endl;
	}
}

void MerkleMain::printWallet()
{
	std::cout << wallet << std::endl;
}

void MerkleMain::gotoNextTimeframe()
{
	std::cout << "Going to next time frame." << std::endl;
	std::cout << currentTime << std::endl;
	MerkleBot bot{wallet, orderBook, currentTime};
	bot.executeTrades();
	currentTime = orderBook.getNextTime(currentTime);
}

int MerkleMain::getUserOption()
{
	int userOption = 0;
	std::string line;
	std::cout << "Type in 1-7" << std::endl;
	std::getline(std::cin, line);
	try
	{
		userOption = std::stoi(line);
	}
	catch (const std::exception& e)
	{
	}
	std::cout << "You chose: " << userOption << std::endl;
	return userOption;
}

void MerkleMain::processUserOption(int userOption)
{
	switch (userOption)
	{
	case 1:
		printHelp();
		break;

	case 2:
		printMarketStats();
		break;

	case 3:
		enterAsk();
		break;

	case 4:
		enterBid();
		break;

	case 5:
		printWallet();
		break;

	case 6:
		gotoNextTimeframe();
		break;

	case 7:
		runBot();
		break;

	default:
		std::cout << "Invalid choice. Choose 1-6." << std::endl;
		break;
	}
}

void MerkleMain::runBot()
{
	MerkleBot bot{wallet, orderBook, currentTime};
	std::cout << "===========" << std::endl;
	std::cout << "Bot starting:" << std::endl;
	std::cout << "Your wallet is worth USD " << wallet.getWalletValue(orderBook, currentTime) << std::endl;
	std::cout << "\nWALLET:" << std::endl;
	std::cout << wallet << std::endl;
	std::cout << "Trading... please stand by..." << std::endl;

	//////// TRADING ////////
	bot.trade();
	/////// END TRADING ////

	std::cout << "===========" << std::endl;
	std::cout << "RESULTS:" << std::endl;
	std::cout << "Your wallet is worth USD " << wallet.getWalletValue(orderBook, currentTime) << std::endl;
	std::cout << "\nWALLET:" << std::endl;
	std::cout << wallet << std::endl;
	std::cout << "===========" << std::endl;
}
