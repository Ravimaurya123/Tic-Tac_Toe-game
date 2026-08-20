# Premium Tic-Tac-Toe in C++ (OOP & DSA)

A modular, console-based, visually styled **Tic-Tac-Toe** game written in C++17. Designed with robust Object-Oriented Programming (OOP) principles, clean Data Structures, and beginner-friendly, readable C++ code.

---

## 🌟 Features

- **Main Menu**: Interactive console interface to start games, read help documentation, review or reset scores, and exit.
- **Player Customization**: Ability to register custom player names before beginning a match.
- **Alternate Turns**: The system alternates turns between Player 1 (`X`, Red) and Player 2 (`O`, Blue) automatically.
- **Interactive Board**: A 3x3 grid displayed with vibrant ANSI colors. Includes subtle numbers (`1` to `9`) showing unoccupied choices.
- **Move Validation**: Rejects invalid inputs (non-integers, out-of-bounds, or already taken spots) without crashing.
- **Victory & Draw Detectors**: Auto-detects row, column, and diagonal alignment wins. Triggers draw matches once all tiles are filled.
- **In-Game Commands**: Players can press `0` at any turn to gracefully resign and return to the main menu.
- **Scoreboard tracker**: Accumulates and prints stats including Player 1 Wins, Player 2 Wins, Draws, and total matches.
- **Score Resetter**: Allows resetting scoreboard statistics.
- **Windows Terminal support**: Automatically configures the Windows Console to support ANSI colors natively using Virtual Terminal sequences.

---

## 📂 Project Structure

```text
Tic-Tac-Toe/
├── Board.h          # Board class declaration
├── Board.cpp        # Board printing, grid mapping, & move execution
├── Player.h         # Player class declaration
├── Player.cpp       # Player class attributes (name, symbols)
├── Game.h           # Game manager declaration
├── Game.cpp         # Main game loop, scoreboard, win checks, & menus
├── main.cpp         # Program entry point
└── README.md        # Project guide & DSA analysis
```

---

## 🛠️ Compilation & Running Instructions

### Prerequisites
Make sure you have a C++17 compatible compiler installed (such as `g++` via MinGW/GCC, Clang, or MSVC via Visual Studio).

### Compiling with GCC / G++ (Command Line)
From the workspace root directory, run the following compilation command:

```bash
g++ -std=c++17 main.cpp Game.cpp Board.cpp Player.cpp -o TicTacToe
```

### Running the Game

#### On Windows:
```cmd
TicTacToe.exe
```

#### On macOS / Linux:
```bash
./TicTacToe
```

---

## 🧠 DSA & OOP Concepts Applied

### 1. Object-Oriented Programming (OOP)
- **Encapsulation**: 
  - `Player` class encapsulates attributes like names and symbols, exposing them via public getters and setters while keeping raw fields private.
  - `Board` encapsulates the 2D array representation `grid[3][3]` and limits direct access to read-only functions (like `getValueAt`).
- **Separation of Concerns**: 
  - The board manages cells and validation, players represent participant metadata, and the game class handles orchestration/scoring.

### 2. Data Structures
- **2D Array (`grid[3][3]`)**:
  - The game grid is mapped to a static 2D `char` array, optimized for quick accesses.
- **Pointers/References (`Player* currentPlayer`)**:
  - Used for alternating active turns dynamically in memory without copying large player objects.

### 3. Core Algorithms
- **Positional Index Mapping**:
  Translates sequential grid positions (`1`–`9`) entered by players into rows and columns in $O(1)$ time complexity:
  $$\text{row} = \frac{\text{position} - 1}{3}$$
  $$\text{col} = (\text{position} - 1) \pmod 3$$

- **Win Scanning Algorithm**:
  Evaluates potential win paths dynamically at the end of each turn. It checks:
  1. Horizontal paths (rows 0, 1, and 2).
  2. Vertical paths (columns 0, 1, and 2).
  3. Diagonal paths (top-left to bottom-right, and top-right to bottom-left).

- **Draw Detecting Algorithm**:
  Iterates over the 3x3 grid to ensure all cells are filled with 'X' or 'O', executing only when a win isn't found.

---

## ⏱️ Complexity Analysis

Since the grid is fixed at a $3 \times 3$ size (constant dimension $N = 3$):

| Operation | Time Complexity | Space Complexity | Explanation |
| :--- | :--- | :--- | :--- |
| **Grid Initialization / Reset** | $O(N^2) \rightarrow O(1)$ | $O(N^2) \rightarrow O(1)$ | Resets the 9 grid elements to '1'-'9'. |
| **Move Validation & Placement** | $O(1)$ | $O(1)$ | Constant index arithmetic and single array access. |
| **Win Condition Checking** | $O(N) \rightarrow O(1)$ | $O(1)$ | Scans 3 rows, 3 columns, and 2 diagonals. |
| **Draw Checking** | $O(N^2) \rightarrow O(1)$ | $O(1)$ | Iterates through 9 cells to check for occupancy. |
| **Rendering Board** | $O(N^2) \rightarrow O(1)$ | $O(1)$ | Prints a fixed board size to the standard output. |

---

## 🔮 Future Improvements
1. **AI Opponent**: Implement a single-player mode with an AI opponent using the **Minimax Algorithm** (decision-tree search) for unbeatable matches, or random moves for easy difficulties.
2. **Dynamic Grid Size**: Refactor the `Board` class to support custom grid dimensions (e.g., 4x4 or 5x5) using dynamic arrays (`std::vector`).
3. **Save/Load States**: Persist scoreboard tallies or active match progress to an external text/JSON file.
4. **Network Multiplayer**: Support playing over LAN or Internet using C++ sockets.
