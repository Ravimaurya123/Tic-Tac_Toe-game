#include "Board.h"
#include <iostream>
#include <string>

// ANSI Color constants for premium aesthetics
namespace BoardColors {
    const std::string RESET   = "\033[0m";
    const std::string BOLD    = "\033[1m";
    const std::string RED     = "\033[38;5;203m"; // Vibrant red for 'X'
    const std::string BLUE    = "\033[38;5;75m";  // Soft blue for 'O'
    const std::string CYAN    = "\033[38;5;86m";  // Turquoise cyan for board grid lines
    const std::string GRAY    = "\033[38;5;244m"; // Dark gray for number hints
}

// Constructor
Board::Board() {
    resetBoard();
}

// Resets board to hold characters '1' through '9'
void Board::resetBoard() {
    char start = '1';
    for (int i = 0; i < 3; ++i) {
        for (int j = 0; j < 3; ++j) {
            grid[i][j] = start++;
        }
    }
}

// Helper to format grid cells with ANSI coloring
static std::string getFormattedCell(char cell) {
    using namespace BoardColors;
    if (cell == 'X') {
        return RED + BOLD + " X " + RESET;
    } else if (cell == 'O') {
        return BLUE + BOLD + " O " + RESET;
    } else {
        // Subtle gray for unoccupied cell number hints
        return GRAY + " " + cell + " " + RESET;
    }
}

// Displays the Board nicely formatted
void Board::displayBoard() const {
    using namespace BoardColors;

    std::cout << "\n";
    std::cout << CYAN << "         │     │     " << RESET << "\n";
    std::cout << "    " << getFormattedCell(grid[0][0]) << CYAN << "│" << RESET 
              << getFormattedCell(grid[0][1]) << CYAN << "│" << RESET 
              << getFormattedCell(grid[0][2]) << "\n";
    std::cout << CYAN << "    ─────┼─────┼─────" << RESET << "\n";
    std::cout << "    " << getFormattedCell(grid[1][0]) << CYAN << "│" << RESET 
              << getFormattedCell(grid[1][1]) << CYAN << "│" << RESET 
              << getFormattedCell(grid[1][2]) << "\n";
    std::cout << CYAN << "    ─────┼─────┼─────" << RESET << "\n";
    std::cout << "    " << getFormattedCell(grid[2][0]) << CYAN << "│" << RESET 
              << getFormattedCell(grid[2][1]) << CYAN << "│" << RESET 
              << getFormattedCell(grid[2][2]) << "\n";
    std::cout << CYAN << "         │     │     " << RESET << "\n";
    std::cout << "\n";
}

// Checks if the position is between 1-9 and not already occupied
bool Board::isValidMove(int position) const {
    if (position < 1 || position > 9) {
        return false;
    }
    
    // Map 1-9 to 2D indices
    int row = (position - 1) / 3;
    int col = (position - 1) % 3;

    // Check if cell contains original number digit (i.e. '1' to '9')
    return (grid[row][col] != 'X' && grid[row][col] != 'O');
}

// Places symbol on the grid
bool Board::makeMove(int position, char symbol) {
    if (!isValidMove(position)) {
        return false;
    }

    int row = (position - 1) / 3;
    int col = (position - 1) % 3;
    grid[row][col] = symbol;
    return true;
}

// Helper to access grid characters (used for checking winning lines)
char Board::getValueAt(int row, int col) const {
    if (row >= 0 && row < 3 && col >= 0 && col < 3) {
        return grid[row][col];
    }
    return ' ';
}
