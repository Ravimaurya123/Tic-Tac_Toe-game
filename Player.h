#ifndef PLAYER_H
#define PLAYER_H

#include <string>

/**
 * @class Player
 * @brief Represents a player in the Tic-Tac-Toe game.
 * 
 * This class encapsulates player details such as their name and their
 * assigned playing symbol (typically 'X' or 'O').
 */
class Player {
private:
    std::string name;
    char symbol;

public:
    /**
     * @brief Default constructor for Player.
     */
    Player();

    /**
     * @brief Parameterized constructor to initialize name and symbol.
     * @param name The name of the player.
     * @param symbol The symbol ('X' or 'O') representing the player.
     */
    Player(const std::string& name, char symbol);

    /**
     * @brief Gets the name of the player.
     * @return The player's name.
     */
    std::string getName() const;

    /**
     * @brief Gets the playing symbol of the player.
     * @return The player's symbol ('X' or 'O').
     */
    char getSymbol() const;

    /**
     * @brief Sets the name of the player.
     * @param name The new name to assign to the player.
     */
    void setName(const std::string& name);

    /**
     * @brief Sets the symbol of the player.
     * @param symbol The symbol to assign ('X' or 'O').
     */
    void setSymbol(char symbol);
};

#endif // PLAYER_H
