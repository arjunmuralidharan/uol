#include "MerkleBot.hpp"

// R1A: Bot accesses orderbook
// When the bot is initialised, it receives a reference to the main application's order book
MerkleBot::MerkleBot(Wallet &_wallet, OrderBook &_orders, std::string &_currentTime)
        : wallet{_wallet}, orderBook{_orders}, currentTime{_currentTime} {
}

// R1B: Bot can generate predictions of future market prices
// Generates a map of buy and sell "stock picks" with a suggested price
// The prediction algorithm uses a simple moving average to determine price trends
std::map<OrderBookType, std::map<std::string, double>> MerkleBot::stockPicks() {
    std::map<OrderBookType, std::map<std::string, double>> predictions;
    std::map<std::string, double> buyPredictions{};
    std::map<std::string, double> sellPredictions{};

    for (const std::string &product : orderBook.products) {
        try {
            std::vector<OrderBookEntry> orders = orderBook.orders.at(currentTime);

            if (orderBook.orders.find(currentTime) != orderBook.orders.begin() && orders.size() > 0) {

                if (simpleMovingAverage(product, 20, OrderBookType::ask) <
                    orderBook.getLowPrice(orders, product, OrderBookType::ask)) {
                    sellPredictions.emplace(product, orderBook.getLowPrice(orders, product, OrderBookType::ask));
                }

                if (simpleMovingAverage(product, 20, OrderBookType::bid) >
                    orderBook.getHighPrice(orders, product, OrderBookType::bid)) {
                    buyPredictions.emplace(product, orderBook.getHighPrice(orders, product, OrderBookType::bid));
                }

            }
        }
        catch (const std::exception &e) {
            continue;
        }
    }
    predictions.emplace(OrderBookType::bid, buyPredictions);
    predictions.emplace(OrderBookType::ask, sellPredictions);
    return predictions;
}

double MerkleBot::simpleMovingAverage(const std::string &product, const int &timeframes, const OrderBookType &type) {
    int observations{0};
    double sumObservations{0};
    std::string timeframe{currentTime};
    while (orderBook.orders.find(timeframe) != orderBook.orders.begin() && observations < timeframes) {
        std::vector<OrderBookEntry> orders{orderBook.getOrders(type, product, timeframe)};
        if (orders.size() > 0) {
            sumObservations += orders.back().price;
            timeframe = orderBook.getPreviousTime(timeframe);
            ++observations;
        } else {
            timeframe = orderBook.getPreviousTime(timeframe);
        }
    }
    return sumObservations / timeframes;
}

// R2A: Bot can generate bids and place them in the order book
// Creates a bid and places it in the order book
// This is called within the trade() function
void MerkleBot::createBid(double price, double amount, std::string product) {
    try {
        OrderBookEntry obe{
                price,
                amount,
                currentTime,
                product,
                OrderBookType::bid,
                "simuser"};

        if (wallet.canFulfillOrder(obe)) {
            orderBook.insertOrder(obe);
            generateBidsAsksSalesLog(obe);
        }
    }
    catch (const std::exception &e) {
        std::cout << "MerkelBot::createBid - Bad input" << std::endl;
    }
}

// R2B: Bot can generate asks and place them in the order book
// Creates an ask and places it in the order book
// This is called within the trade() function
void MerkleBot::createAsk(double price, double amount, std::string product) {
    try {
        OrderBookEntry obe{
                price,
                amount,
                currentTime,
                product,
                OrderBookType::ask,
                "simuser"};

        if (wallet.canFulfillOrder(obe)) {
            orderBook.insertOrder(obe);
            generateBidsAsksSalesLog(obe);
        }
    }
    catch (const std::exception &e) {
        std::cout << "MerkelBot::createAsk - Bad input" << std::endl;
    }
}

// R2C: Bot updates wallet after successful sales
// Trading algorithm reviews the stock picks and generates asks and bids, moving through the order book
void MerkleBot::trade() {
    // Execute any pending, user-created trades first
    executeTrades();

    // Start the bot trader, going over the entire order book starting at the current time
    for (std::map<std::string, std::vector<OrderBookEntry >>::iterator orderIterator{
            orderBook.orders.find(currentTime)}; orderIterator != orderBook.orders.end();
         ++orderIterator) {
        // Get stock picks for bids
        std::map<std::string, double> bidPicks{stockPicks().at(OrderBookType::bid)};

        // If stock picks exist, create bids for each stock pick
        if (bidPicks.size() > 0) {
            for (auto const[product, price] : bidPicks) {
                // Get the currency pair for the stock pick product
                std::string currency = product.substr(product.find("/") + 1);

                // Get the correct balance from your wallet
                double balance{wallet.checkBalance(currency)};

                // Create the bid, splitting your balance across all bids for the same currency
                createBid(price, (balance / bidPicks.count(product)) * price, product);
            }
        }

        std::map<std::string, double> askPicks{stockPicks().at(OrderBookType::ask)};

        if (askPicks.size() > 0) {
            for (auto const[product, price] : askPicks) {
                std::string currency = product.substr(0, product.find("/"));

                double balance{wallet.checkBalance(currency)};
                createAsk(price, (balance / askPicks.size()) * price, product);
            }
        }

        executeTrades();
        currentTime = orderIterator->first;
    }
    generateWalletLog();
}

// Any resulting sales are executed and the wallet is updates
void MerkleBot::executeTrades() {
    for (const std::string &product : orderBook.products) {
        std::vector<OrderBookEntry> sales = orderBook.matchAsksToBids(product, currentTime);

        for (OrderBookEntry &sale : sales) {
            if (sale.username == "simuser" && wallet.canFulfillOrder(sale)) {
                wallet.processSale(sale);
                generateBidsAsksSalesLog(sale);
            }
        }
    }
}

// R3A: Bot generates a log of the contents of its wallet
void MerkleBot::generateWalletLog() {
    std::ofstream walletLog;
    walletLog.open("walletLog.txt");
    walletLog << wallet << std::endl;
    walletLog.close();
}

// R3B: Bot generates a log of its bids and asks
// R3C: Bot generates a log of its sales
// A single function handles bids, asks and sales and pushes the orders to the respective log files
void MerkleBot::generateBidsAsksSalesLog(const OrderBookEntry &order) {
    std::ofstream logFile;
    if (order.orderType == OrderBookType::ask || order.orderType == OrderBookType::bid) {
        logFile.open("bidsAsksLog.txt", std::ios::app);
    } else if (order.orderType == OrderBookType::asksale || order.orderType == OrderBookType::bidsale) {
        std::ofstream salesLog;
        logFile.open("sales.txt", std::ios::app);
        std::cout << "Sale: " << order.product << ", " << order.amount << std::endl;
    } else {
        logFile.open("errors.txt", std::ios::app);
    }

    logFile << order.timestamp << "," << order.product << "," << std::setprecision(5) << order.price << ","
            << std::setprecision(5) << order.amount << ", "
            << order.username << std::endl;
    logFile.close();
}
