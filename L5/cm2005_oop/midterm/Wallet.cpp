#include "Wallet.hpp"

Wallet::Wallet()
{
}

void Wallet::insertCurrency(const std::string& type, double amount)
{
	double balance;
	if (amount < 0)
	{
		throw std::exception{};
	}
	if (currencies.count(type) == 0)  // not there yet
	{
		balance = 0;
	}
	else
	{  // is there
		balance = currencies[type];
	}
	balance += amount;
	currencies[type] = balance;
}

bool Wallet::removeCurrency(const std::string& type, double amount)
{
	if (amount < 0)
	{
		return false;
	}
	if (currencies.count(type) == 0)  // not there yet
	{
		//std::cout << "No currency for " << type << std::endl;
		return false;
	}
	else
	{										 // is there - do  we have enough
		if (containsCurrency(type, amount))	 // we have enough
		{
			//std::cout << "Removing " << type << ": " << amount << std::endl;
			currencies[type] -= amount;
			return true;
		}
		else  // they have it but not enough.
			return false;
	}
}

bool Wallet::containsCurrency(const std::string& type, double amount)
{
	// Check for valid amount
	try
	{
		if (amount < 0)
		{
			throw "Wallet::containsCurrency: Looking for a negative amount";
		}
	}
	catch (const char* e)
	{
		std::cout << e << std::endl;
		return false;
	}

	// Check if the currency is present with at least the specificied amount
	if (currencies.count(type) == 0)  // not there yet
		return false;
	else
		return currencies[type] >= amount;
}

std::string Wallet::toString()
{
	std::string s;
	for (const auto& [currency, amount] : currencies)
	{
		s += currency + ": " + std::to_string(amount) + "\n";
	}
	return s;
}

bool Wallet::canFulfillOrder(const OrderBookEntry& order)
{
	// TODO replace tokenize function with simple substring logic
	std::vector<std::string> currs = CSVReader::tokenise(order.product, '/');

	// ask
	if (order.orderType == OrderBookType::ask || order.orderType == OrderBookType::asksale)
	{
		double amount = order.amount;
		std::string currency = currs[0];
		return containsCurrency(currency, amount);
	}
	// bid
	if (order.orderType == OrderBookType::bid || order.orderType == OrderBookType::bidsale)
	{
		double amount = order.amount * order.price;
		std::string currency = currs[1];
		return containsCurrency(currency, amount);
	}
	return false;
}

void Wallet::processSale(OrderBookEntry& sale)
{
	// TODO replace tokenize function with simple substring logic
	std::vector<std::string> currs = CSVReader::tokenise(sale.product, '/');  // ask
	if (sale.orderType == OrderBookType::asksale)
	{
		double outgoingAmount = sale.amount;
		std::string outgoingCurrency = currs[0];
		double incomingAmount = sale.amount * sale.price;
		std::string incomingCurrency = currs[1];
		currencies[incomingCurrency] += incomingAmount;
		currencies[outgoingCurrency] -= outgoingAmount;
	}
	// bid
	if (sale.orderType == OrderBookType::bidsale)
	{
		double incomingAmount = sale.amount;
		std::string incomingCurrency = currs[0];
		double outgoingAmount = sale.amount * sale.price;
		std::string outgoingCurrency = currs[1];
		currencies[incomingCurrency] += incomingAmount;
		currencies[outgoingCurrency] -= outgoingAmount;
	}
}

std::ostream& operator<<(std::ostream& os, Wallet& wallet)
{
	os << wallet.toString();
	return os;
}

double Wallet::checkBalance(const std::string& currency)
{
	if (currencies.count(currency) > 0)
	{
		return currencies.at(currency);
	}
	else
	{
		return 0;
	}
}

std::map<std::string, double> Wallet::getCurrencies()
{
	return currencies;
}

double Wallet::getWalletValue(OrderBook& orderBook, std::string currentTime)
{
	std::map<std::string, double> currencies = getCurrencies();
	double walletValue{0};
	for (auto const [currency, amount] : currencies)
	{
		if (currency != "USDT")
		{
			std::string product = currency + "/USDT";

			// We want to calculate the value of our balance based on the most recent asking price. Sometimes no orders exist in the current timeframe to inform the valuation of a given currency.
			// While no orders for a specific product exist, keep going to the previous timeframe and get the orders there until we find an order with the desired currency
			std::map<std::string, std::vector<OrderBookEntry>>::iterator orderIterator{orderBook.orders.find(currentTime)};
			while (orderBook.getOrders(OrderBookType::ask, product, currentTime).size() == 0)
			{
				--orderIterator;
				currentTime = orderIterator->first;
			}

			walletValue += orderBook.getHighPrice(orderBook.orders.at(currentTime), product, OrderBookType::ask) * amount;
		}
	}
	return walletValue;
}
