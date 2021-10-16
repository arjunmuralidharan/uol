#ifndef WALLET_H
#define WALLET_H

#include <iostream>
#include <map>
#include <string>

#include "OrderBook.hpp"

class Wallet
{
public:
	Wallet();

	/** Insert currency to the wallet. */
	void insertCurrency(const std::string& type, double amount);

	/** Remove currency from the wallet. */
	bool removeCurrency(const std::string& type, double amount);

	/** Check if the order can be fulfilled */
	bool canFulfillOrder(const OrderBookEntry& order);

	/** Check if the wallet contains this much currency or more. */
	bool containsCurrency(const std::string& type, const double amount = 0);

	/** Process the sale */
	void processSale(OrderBookEntry& sale);

	/** Generate a string representation of the wallet. */
	std::string toString();

	/** Get the balance of a specific currency */
	double checkBalance(const std::string& currency);

	/** Retrieve the currencies present in the wallet */
	std::map<std::string, double> getCurrencies();

	/** Get the value of the wallet in USDT */
	double getWalletValue(OrderBook& orderBook, std::string currentTime);

private:
	std::map<std::string, double> currencies;
	friend std::ostream& operator<<(std::ostream& os, Wallet& wallet);
};

#endif
