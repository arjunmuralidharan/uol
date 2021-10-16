#ifndef ORDERBOOKENTRY_H
#define ORDERBOOKENTRY_H

#include <string>

enum class OrderBookType
{
	bid,
	ask,
	asksale,
	bidsale,
	unknown
};

class OrderBookEntry
{
public:
	OrderBookEntry(const double _price,
				   const double _amount,
				   const std::string& _timestamp,
				   const std::string& _product,
				   const OrderBookType& _orderType,
				   const std::string& _username = "dataset");
	double price;
	double amount;
	std::string timestamp;
	std::string product;
	OrderBookType orderType;
	std::string username;

	/** Convert a string to an OrderBookType (ask, bid, etc.) */
	static OrderBookType stringToOrderBookType(const std::string& s);

};

#endif
