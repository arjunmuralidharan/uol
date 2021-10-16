#include "LinkedList.hpp"

LinkedList::LinkedList(){
    head = 0;
}

LinkedList::~LinkedList(){
}

void LinkedList::insertSorted(LinkedList::Node*& _head,int _value){
    
}
int LinkedList::length(LinkedList::Node*& _head){
    return -1;
}

int LinkedList::search(LinkedList::Node*& _head,int _value){
    return -1;
}
void LinkedList::remove(LinkedList::Node*& _head,int _value){
    
}


void LinkedList::display(LinkedList::Node*& _head){
    Node* iterator = _head; // Do not want to move the actual head, make a copy
    
    if (iterator == NULL){
        cout << "The list is empty";
    }
    
    while(iterator!=NULL)
    {
        cout << "[" + std::to_string(iterator->data) + "] ";
        iterator=iterator->next;
    }
}

LinkedList::Node*& LinkedList::getHead(){
    return*& this->head;
}

