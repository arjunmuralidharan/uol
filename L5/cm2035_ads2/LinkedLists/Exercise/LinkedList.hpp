#ifndef LinkedList_hpp
#define LinkedList_hpp

#include <stdio.h>
#include <iostream>
#include <fstream>
using namespace std;

class LinkedList{
    
private:
    struct Node{
        int data;
        Node* next;
    };
    Node* head = 0;
    
public:
    LinkedList();
    ~LinkedList();
    
    void insertSorted(Node*& _head,int _value);
    int length(Node*& _head);
    int search(Node*& _head,int _value);
    void remove(Node*& _head,int _value);
    void display(Node*& _head);
    Node*& getHead();
};

#endif /* LinkedList_hpp */
