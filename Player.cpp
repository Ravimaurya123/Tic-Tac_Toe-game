#include "Player.h"

// Default constructor
Player::Player() : name(""), symbol(' ') {}

// Parameterized constructor
Player::Player(const std::string& name, char symbol) : name(name), symbol(symbol) {}

// Getter for player name
std::string Player::getName() const {
    return name;
}

// Getter for player symbol
char Player::getSymbol() const {
    return symbol;
}

// Setter for player name
void Player::setName(const std::string& name) {
    this->name = name;
}

// Setter for player symbol
void Player::setSymbol(char symbol) {
    this->symbol = symbol;
}
