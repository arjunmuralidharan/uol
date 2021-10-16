cmake_minimum_required(VERSION 3.17)
project(merklerex)

set(CMAKE_CXX_STANDARD 14)

include_directories(.)

add_executable(merklerex
        CSVReader.cpp
        CSVReader.hpp
        main.cpp
        MerkleBot.cpp
        MerkleBot.hpp
        MerkleMain.cpp
        MerkleMain.hpp
        OrderBook.cpp
        OrderBook.hpp
        OrderBookEntry.cpp
        OrderBookEntry.hpp
        Wallet.cpp
        Wallet.hpp)
