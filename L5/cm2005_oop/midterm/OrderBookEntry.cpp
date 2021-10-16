#include "OrderBookEntry.hpp"

OrderBookEntry::OrderBookEntry(
	const double _price,
	const double _amount,
	const std::string& _timestamp,
	const std::string& _product,
	const OrderBookType& _orderType,
	const std::string& _username) : price{_price},
									amount{_amount},
									timestamp{_timestamp},
									product{_product},
									orderType{_orderType},
									username{_username}
{
}

OrderBookType OrderBookEntry::stringToOrderBookType(const std::string& s)
{
	if (s == "ask")
	{
		return OrderBookType::ask;
	}
	else if (s == "bid")
	{
		return OrderBookType::bid;
	}
	else
	{
		return OrderBookType::unknown;
	}
}


