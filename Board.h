#ifndef BOARD_H
#define BOARD_H

/**
 * @class Board
 * @brief Manages the 3x3 Tic-Tac-Toe playing grid.
 * 
 * This class encapsulates a 2D array representing the game board. It handles
 * drawing the board to the screen, updating cell values when players make moves,
 * validating inputs, and resetting the board state for new games.
 */
class Board {
private:
    char grid[3][3]; // 2D array representing the 3x3 grid

public:
    /**
     * @brief Constructor for Board. Initializes cells to numbers '1' through '9'.
     */
    Board();

    /**
     * @brief Prints the board in a stylized console format.
     */
    void displayBoard() const;

    /**
     * @brief Checks if a move at a given position is valid (i.e. between 1 and 9, and not already occupied).
     * @param position The board cell position selected (1-9).
     * @return True if the position is within range and empty, false otherwise.
     */
    bool isValidMove(int position) const;

    /**
     * @brief Places a player's symbol at the specified board position.
     * @param position The board cell position (1-9).
     * @param symbol The character ('X' or 'O') to be placed.
     * @return True if the move was successfully made, false if invalid.
     */
    bool makeMove(int position, char symbol);

    /**
     * @brief Resets the board grid cells to their default '1'-'9' character values.
     */
    void resetBoard();

    /**
     * @brief Retrieves the value currently stored at a specific row and column.
     * @param row The row index (0-2).
     * @param col The column index (0-2).
     * @return The character stored at grid[row][col].
     */
    char getValueAt(int row, int col) const;
};

#endif // BOARD_H
