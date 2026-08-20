#include "Game.h"

/**
 * @brief Entry point of the Tic-Tac-Toe program.
 * 
 * Instantiates the Game controller class and boots up the main menu loop.
 * 
 * @return Exit code (0 for success).
 */
int main() {
    Game game;
    game.displayMenu();
    return 0;
}
