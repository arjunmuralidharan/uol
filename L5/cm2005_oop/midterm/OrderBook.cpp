#include "OrderBook.hpp"

#include <algorithm>
#include <iostream>

#include "OrderBookEntry.hpp"

OrderBook::OrderBook(const std::string& filename)
{
	std::cout << "Loading market data..." << std::endl;
	orders = CSVReader::readCSV(filename);
	std::cout << "Read " << orders.size() << " timestamps." << std::endl;
	products = getKnownProducts();
}

std::unordered_set<std::string> OrderBook::getKnownProducts()
{
	std::unordered_set<std::string> products;
	for (auto const& [timestamp, orderVec] : orders)
	{
		for (const OrderBookEntry order : orderVec)
		{
			products.insert(order.product);
		}
	}
	return products;
}

std::vector<OrderBookEntry> OrderBook::getOrders(const OrderBookType& type,
												 const std::string& product,
												 const std::string& timestamp)
{
	std::vector<OrderBookEntry> matchedOrders{};
	if (orders.find(timestamp) != orders.end())
	{
		for (const OrderBookEntry& order : orders.at(timestamp))
		{
			if (order.orderType == type &&
				order.product == product)
			{
				matchedOrders.push_back(order);
			}
		}
	}
	return matchedOrders;
}

double OrderBook::getHighPrice(const std::vector<OrderBookEntry>& orders, const std::string& product, const OrderBookType& type)
{
	double high{orders[0].price};

	for (const OrderBookEntry& e : orders)
	{
		if (e.price > high && e.product == product && e.orderType == type)
		{
			high = e.price;
		}
	}
	return high;
}

double OrderBook::getLowPrice(const std::vector<OrderBookEntry>& orders, const std::string& product, const OrderBookType& type)
{
	double low{orders[0].price};
	for (const OrderBookEntry& e : orders)
	{
		if (e.price < low && e.product == product && e.orderType == type)
		{
			low = e.price;
		}
	}
	return low;
}

void OrderBook::insertOrder(const OrderBookEntry& order)
{
	orders.at(order.timestamp)
		.push_back(order);
}

// Matching Engine
std::vector<OrderBookEntry> OrderBook::matchAsksToBids(const std::string& product, const std::string& timestamp)
{
	std::vector<OrderBookEntry> asks = getOrders(OrderBookType::ask, product, timestamp);
	std::vector<OrderBookEntry> bids = getOrders(OrderBookType::bid, product, timestamp);
	std::vector<OrderBookEntry> sales{};

	if (asks.size() == 0 || bids.size() == 0)
	{
		return sales;
	}

	for (OrderBookEntry& ask : asks)
	{
		for (OrderBookEntry& bid : bids)
		{
			if (bid.price >= ask.price)
			{
				OrderBookEntry sale{ask.price, 0, timestamp,
									product,
									OrderBookType::asksale};

				if (bid.username == "simuser")
				{
					sale.username = "simuser";
					sale.orderType = OrderBookType::bidsale;
				}

				if (ask.username == "simuser")
				{
					sale.username = "simuser";
					sale.orderType = OrderBookType::asksale;
				}

				if (bid.amount == ask.amount)
				{
					sale.amount = ask.amount;
					sales.push_back(sale);
					bid.amount = 0;
					break;
				}

				if (bid.amount > ask.amount)
				{
					sale.amount = ask.amount;
					sales.push_back(sale);
					bid.amount = bid.amount - ask.amount;
					break;
				}

				if (bid.amount < ask.amount &&
					bid.amount > 0)
				{
					sale.amount = bid.amount;
					sales.push_back(sale);
					ask.amount = ask.amount - bid.amount;
					bid.amount = 0;
					continue;
				}
			}
		}
	}
	return sales;
}

std::string OrderBook::getNextTime(const std::string& timestamp)
{
	if (orders.find(timestamp) != orders.end())
	{
		return std::next(orders.find(timestamp), 1)->first;
	}
	else
	{
		return orders.begin()->first;
	}
}

std::string OrderBook::getPreviousTime(const std::string& timestamp)
{
	if (orders.find(timestamp) != orders.begin())
	{
		return std::prev(orders.find(timestamp), 1)->first;
	}
	else
	{
		return orders.begin()->first;
	}
}
