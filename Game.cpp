#include "Game.h"
#include <iostream>
#include <limits>

#ifdef _WIN32
#include <windows.h>
#ifndef ENABLE_VIRTUAL_TERMINAL_PROCESSING
#define ENABLE_VIRTUAL_TERMINAL_PROCESSING 0x0004
#endif
#endif

// ANSI colors for Game UI
namespace GameColors {
    const std::string RESET   = "\033[0m";
    const std::string BOLD    = "\033[1m";
    const std::string RED     = "\033[38;5;203m"; // Red for 'X'
    const std::string BLUE    = "\033[38;5;75m";  // Blue for 'O'
    const std::string GREEN   = "\033[38;5;120m"; // Green for success messages
    const std::string YELLOW  = "\033[38;5;220m"; // Yellow for headers & prompts
    const std::string MAGENTA = "\033[38;5;176m"; // Magenta for names
    const std::string CYAN    = "\033[38;5;86m";  // Cyan for separators
}

// Constructor: initializes scores and terminal properties
Game::Game() 
    : currentPlayer(nullptr), person1Wins(0), person2Wins(0), draws(0), totalGames(0) {
    enableVirtualTerminalProcessing();
    // Default names initially
    person1 = Player("Player 1", 'X');
    person2 = Player("Player 2", 'O');
}

// Windows-specific setup to enable standard ANSI console color sequences
void Game::enableVirtualTerminalProcessing() {
#ifdef _WIN32
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hOut != INVALID_HANDLE_VALUE) {
        DWORD dwMode = 0;
        if (GetConsoleMode(hOut, &dwMode)) {
            dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
            SetConsoleMode(hOut, dwMode);
        }
    }
#endif
}

// Clears the console window using ANSI codes
void Game::clearScreen() const {
    std::cout << "\033[2J\033[H" << std::flush;
}

// Formats a centered title card for sections
void Game::printHeader(const std::string& title) const {
    using namespace GameColors;
    std::cout << CYAN << "==========================================\n" << RESET;
    std::cout << BOLD << YELLOW << "  " << title << "\n" << RESET;
    std::cout << CYAN << "==========================================\n" << RESET;
}

// Gets player names before game starts
void Game::setupPlayers() {
    clearScreen();
    printHeader("WELCOME TO TIC-TAC-TOE GAME");
    
    std::string name1, name2;
    std::cout << "\nEnter name for Player 1 (" << GameColors::RED << "X" << GameColors::RESET << "): ";
    std::getline(std::cin, name1);
    if (name1.empty()) {
        name1 = "Player 1";
    }

    std::cout << "Enter name for Player 2 (" << GameColors::BLUE << "O" << GameColors::RESET << "): ";
    std::getline(std::cin, name2);
    if (name2.empty()) {
        name2 = "Player 2";
    }

    person1.setName(name1);
    person2.setName(name2);
}

// Interactive main menu
void Game::displayMenu() {
    int choice = 0;
    while (true) {
        clearScreen();
        printHeader("TIC-TAC-TOE MAIN MENU");
        std::cout << "  1. Start New Game\n";
        std::cout << "  2. View Scoreboard\n";
        std::cout << "  3. Reset Scoreboard\n";
        std::cout << "  4. Help / How to Play\n";
        std::cout << "  5. Exit\n\n";
        std::cout << GameColors::YELLOW << "Enter your choice (1-5): " << GameColors::RESET;

        if (std::cin >> choice) {
            // Consume remaining characters (like newline) to prevent issues with future gets/getlines
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            
            switch (choice) {
                case 1:
                    setupPlayers();
                    playGame();
                    break;
                case 2:
                    showScoreboard();
                    break;
                case 3:
                    resetScoreboard();
                    break;
                case 4:
                    displayHelp();
                    break;
                case 5:
                    std::cout << GameColors::GREEN << "\nThanks for playing! Goodbye.\n" << GameColors::RESET;
                    return;
                default:
                    std::cout << GameColors::RED << "\nInvalid Choice! Select between 1 and 5.\n" << GameColors::RESET;
                    std::cout << "Press Enter to continue...";
                    std::cin.get();
            }
        } else {
            // Handle non-integer inputs (characters/strings) without crashing
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            std::cout << GameColors::RED << "\nInvalid Input! Please enter a number.\n" << GameColors::RESET;
            std::cout << "Press Enter to continue...";
            std::cin.get();
        }
    }
}

// Controls a complete match flow
void Game::playGame() {
    board.resetBoard();
    currentPlayer = &person1;
    bool matchRunning = true;

    while (matchRunning) {
        clearScreen();
        printHeader("TIC-TAC-TOE MATCH");
        std::cout << GameColors::MAGENTA << " " << person1.getName() << " (" 
                  << GameColors::RED << "X" << GameColors::MAGENTA << ")  VS  " 
                  << person2.getName() << " (" 
                  << GameColors::BLUE << "O" << GameColors::MAGENTA << ")\n" << GameColors::RESET;

        board.displayBoard();

        // Print whose turn it is in their matching color
        bool isX = (currentPlayer->getSymbol() == 'X');
        std::cout << (isX ? GameColors::RED : GameColors::BLUE) << GameColors::BOLD 
                  << currentPlayer->getName() << "'s Turn (" << currentPlayer->getSymbol() << ")\n" << GameColors::RESET;
        std::cout << "Enter cell position (1-9) or 0 to quit to menu: ";

        int position;
        if (std::cin >> position) {
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

            if (position == 0) {
                std::cout << GameColors::YELLOW << "\nGame abandoned. Returning to menu...\n" << GameColors::RESET;
                std::cout << "Press Enter to continue...";
                std::cin.get();
                return;
            }

            if (board.isValidMove(position)) {
                board.makeMove(position, currentPlayer->getSymbol());

                if (checkWinner()) {
                    clearScreen();
                    printHeader("MATCH OVER - WINNER!");
                    board.displayBoard();
                    std::cout << GameColors::GREEN << GameColors::BOLD << "★ Congratulations! " 
                              << currentPlayer->getName() << " Wins! ★\n\n" << GameColors::RESET;
                    
                    if (currentPlayer == &person1) {
                        person1Wins++;
                    } else {
                        person2Wins++;
                    }
                    totalGames++;
                    matchRunning = false;
                } else if (checkDraw()) {
                    clearScreen();
                    printHeader("MATCH OVER - DRAW");
                    board.displayBoard();
                    std::cout << GameColors::YELLOW << GameColors::BOLD << "Game Draw! The board is full.\n\n" << GameColors::RESET;
                    draws++;
                    totalGames++;
                    matchRunning = false;
                } else {
                    switchPlayer();
                }
            } else {
                std::cout << GameColors::RED << "\nInvalid Move! Cell is either occupied or out of bounds (1-9).\n" << GameColors::RESET;
                std::cout << "Press Enter to try again...";
                std::cin.get();
            }
        } else {
            // Handle character or string entries
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            std::cout << GameColors::RED << "\nInvalid Input! Please type a number between 1 and 9.\n" << GameColors::RESET;
            std::cout << "Press Enter to try again...";
            std::cin.get();
        }
    }

    std::cout << "Press Enter to return to main menu...";
    std::cin.get();
}

// Switches turns between players
void Game::switchPlayer() {
    currentPlayer = (currentPlayer == &person1) ? &person2 : &person1;
}

// Scans rows, cols, and diagonals to determine if player wins
bool Game::checkWinner() const {
    char sym = currentPlayer->getSymbol();

    // 1. Check rows
    for (int i = 0; i < 3; ++i) {
        if (board.getValueAt(i, 0) == sym && board.getValueAt(i, 1) == sym && board.getValueAt(i, 2) == sym) {
            return true;
        }
    }

    // 2. Check columns
    for (int j = 0; j < 3; ++j) {
        if (board.getValueAt(0, j) == sym && board.getValueAt(1, j) == sym && board.getValueAt(2, j) == sym) {
            return true;
        }
    }

    // 3. Check diagonals
    if (board.getValueAt(0, 0) == sym && board.getValueAt(1, 1) == sym && board.getValueAt(2, 2) == sym) {
        return true;
    }
    if (board.getValueAt(0, 2) == sym && board.getValueAt(1, 1) == sym && board.getValueAt(2, 0) == sym) {
        return true;
    }

    return false;
}

// Checks if board is full and no moves remain
bool Game::checkDraw() const {
    for (int i = 0; i < 3; ++i) {
        for (int j = 0; j < 3; ++j) {
            char val = board.getValueAt(i, j);
            // If any cell contains a digit, there is still an empty spot
            if (val != 'X' && val != 'O') {
                return false;
            }
        }
    }
    return true;
}

// Prints the total scoreboard stats
void Game::showScoreboard() const {
    clearScreen();
    printHeader("GAME SCOREBOARD");
    
    std::string p1Name = person1.getName();
    std::string p2Name = person2.getName();

    std::cout << "\n  " << GameColors::MAGENTA << p1Name << GameColors::RESET 
              << " (" << GameColors::RED << "X" << GameColors::RESET << ") Wins: " 
              << GameColors::GREEN << GameColors::BOLD << person1Wins << GameColors::RESET << "\n";
              
    std::cout << "  " << GameColors::MAGENTA << p2Name << GameColors::RESET 
              << " (" << GameColors::BLUE << "O" << GameColors::RESET << ") Wins: " 
              << GameColors::GREEN << GameColors::BOLD << person2Wins << GameColors::RESET << "\n";
              
    std::cout << "  Draws:            " 
              << GameColors::YELLOW << GameColors::BOLD << draws << GameColors::RESET << "\n";
              
    std::cout << "  Total Games:      " 
              << GameColors::CYAN << GameColors::BOLD << totalGames << GameColors::RESET << "\n\n";

    std::cout << "Press Enter to return to main menu...";
    std::cin.get();
}

// Resets scoreboard numbers to zero
void Game::resetScoreboard() {
    clearScreen();
    printHeader("RESET SCOREBOARD");
    person1Wins = 0;
    person2Wins = 0;
    draws = 0;
    totalGames = 0;
    std::cout << GameColors::GREEN << "\nScoreboard has been successfully reset to 0!\n\n" << GameColors::RESET;
    std::cout << "Press Enter to return to main menu...";
    std::cin.get();
}

// Help text on how to play and the controls
void Game::displayHelp() const {
    clearScreen();
    printHeader("HELP / HOW TO PLAY");
    std::cout << "\n  Rules:\n";
    std::cout << "  - Played on a 3x3 grid.\n";
    std::cout << "  - Player 1 uses " << GameColors::RED << "X" << GameColors::RESET 
              << ", Player 2 uses " << GameColors::BLUE << "O" << GameColors::RESET << ".\n";
    std::cout << "  - Players take turns entering a number from 1 to 9.\n";
    std::cout << "  - Align 3 of your symbols vertically, horizontally, or\n";
    std::cout << "    diagonally to win.\n";
    std::cout << "  - If all spots are taken and no one has aligned 3,\n";
    std::cout << "    the game is a Draw.\n\n";

    std::cout << "  Board Grid Reference Map:\n";
    std::cout << GameColors::CYAN << "         │     │     \n";
    std::cout << "      1  │  2  │  3  \n";
    std::cout << "    ─────┼─────┼─────\n";
    std::cout << "      4  │  5  │  6  \n";
    std::cout << "    ─────┼─────┼─────\n";
    std::cout << "      7  │  8  │  9  \n";
    std::cout << "         │     │     \n\n" << GameColors::RESET;

    std::cout << "  Mid-Game Controls:\n";
    std::cout << "  - Enter '0' to quit back to Main Menu.\n\n";

    std::cout << "Press Enter to return to main menu...";
    std::cin.get();
}
