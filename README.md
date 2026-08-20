# ✨ Premium Neon Tic-Tac-Toe (Web & C++)

A high-performance, visually stunning **Tic-Tac-Toe** application featuring a modern **Web App** (with AI Minimax Bot & Canvas FX) and a modular **C++ Console Engine**.

🚀 **Live Web App Demo**: [https://tic-tac-toe-game-jlj8.onrender.com](https://tic-tac-toe-game-jlj8.onrender.com)

---

## 🌐 Web Application Features

- 🎮 **Multiple Game Modes**:
  - **Pass & Play (2 Players)**: Play locally with a friend.
  - **vs Computer (AI Mode)**: Play against an AI opponent with customizable difficulty:
    - **Easy**: Random decision placement.
    - **Medium**: Smart win/block heuristics + 50% minimax.
    - **Impossible**: Unbeatable AI powered by the **Minimax Algorithm**.
- ✨ **Dynamic Moving Neon Particles Background**: Hardware-accelerated HTML5 Canvas with floating neon particles (Pink `#ff3b69`, Cyan `#00f0ff`, Violet `#7c4dff`) connected by dynamic glow lines.
- 🖱️ **Interactive Cursor FX**:
  - Smooth spring-following glowing cursor ring.
  - Custom neon trailing particle trail.
  - Interactive click burst explosion effects.
- 🥳 **Dynamic Punch Emoji Animations**:
  - Victory: Pop & rotating **Joy Emoji (🥳)** with glowing aura.
  - Defeat: Drop & shaking **Sad Emoji (😢)** on losing to AI.
  - Draw: **Handshake Emoji (🤝)**.
- 📊 **Scoreboard & Persistence**: Tracks Player 1 Wins, Player 2 / Computer Wins, Draws, and Total Games played with `localStorage` persistence.
- 🎨 **Glassmorphism Theme**: Cyberpunk neon dark aesthetic with backdrop blur effects and crisp typography (`Outfit` & `Inter`).

---

## 📂 Project Structure

```text
Tic-Tac-Toe/
├── index.html           # Web app structure & modal overlays
├── style.css            # Glassmorphism design system & animations
├── app.js               # Minimax AI Engine, Game State, & Canvas FX
├── package.json         # Server scripts & port configuration
├── Board.h / Board.cpp  # C++ Board class declaration & grid logic
├── Player.h / Player.cpp # C++ Player class attributes
├── Game.h / Game.cpp    # C++ Game loop, win detection, & scoring
├── main.cpp             # C++ Console entry point
└── README.md            # Complete project documentation
```

---

## 🚀 Running the Web Application Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Step 1: Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/Tic-Tac-Toe.git
cd Tic-Tac-Toe
```

### Step 2: Start the application
```bash
npm start
```
Or:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:8000`.

---

## 💻 Compiling & Running the C++ Console Engine

### Compiling with G++ (C++17)
```bash
g++ -std=c++17 main.cpp Game.cpp Board.cpp Player.cpp -o TicTacToe
```

### Running Executable
- **Windows**:
  ```cmd
  .\TicTacToe.exe
  ```
- **macOS / Linux**:
  ```bash
  ./TicTacToe
  ```

---

## 🧠 Algorithms & Data Structures Applied

### 1. Minimax Algorithm (AI Decision Tree)
Evaluates game states recursively to compute the optimal move for the AI:
$$\text{Score}(\text{State}) = \begin{cases} +10 - \text{depth} & \text{if Computer wins} \\ \text{depth} - 10 & \text{if Human wins} \\ 0 & \text{if Draw} \end{cases}$$

### 2. Positional Index Mapping
Translates 1D index ($0..8$) to 2D matrix coordinates ($row, col$) in $O(1)$ time complexity:
$$\text{row} = \lfloor \text{index} / 3 \rfloor, \quad \text{col} = \text{index} \pmod 3$$

---

## 📜 License
This project is open source under the MIT License.

