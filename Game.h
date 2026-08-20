#ifndef GAME_H
#define GAME_H

#include "Board.h"
#include "Player.h"
#include <string>

/**
 * @class Game
 * @brief Controls the state, menus, scoreboard, and main loops of the Tic-Tac-Toe program.
 * 
 * This class coordinates the game board and player instances, handles user selections, 
 * alternates turns, checks win/draw conditions, and persists score statistics.
 */
class Game {
private:
    Board board;
    Player player1;
    Player player2;
    Player* currentPlayer;

    // Scoreboard variables
    int player1Wins;
    int player2Wins;
    int draws;
    int totalGames;

    // Internal helper methods
    void clearScreen() const;
    void printHeader(const std::string& title) const;
    void setupPlayers();
    void enableVirtualTerminalProcessing();

public:
    /**
     * @brief Constructor for Game. Initializes scoreboard and console setup.
     */
    Game();

    /**
     * @brief Displays the interactive main menu of the program.
     */
    void displayMenu();

    /**
     * @brief Manages the loop for playing a single Tic-Tac-Toe match.
     */
    void playGame();

    /**
     * @brief Alternates the active player turn between Player 1 and Player 2.
     */
    void switchPlayer();

    /**
     * @brief Checks if there are three of the same symbols in any row, column, or diagonal.
     * @return True if the current board state contains a winner, false otherwise.
     */
    bool checkWinner() const;

    /**
     * @brief Checks if the board is completely filled without a winner.
     * @return True if the game is a draw, false otherwise.
     */
    bool checkDraw() const;

    /**
     * @brief Prints the scoreboard statistics to the console.
     */
    void showScoreboard() const;

    /**
     * @brief Resets all wins, draws, and total games counters to zero.
     */
    void resetScoreboard();

    /**
     * @brief Shows a detailed rules guide and controls reference.
     */
    void displayHelp() const;
};

#endif // GAME_H
