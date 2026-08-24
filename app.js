// Premium Tic-Tac-Toe Game Engine with AI & Canvas FX

// Win Combinations matrix (rows, columns, diagonals)
const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// State variables
let board = Array(9).fill(null);
let player1 = { name: "Player 1", symbol: "X" };
let player2 = { name: "Computer 🤖", symbol: "O" };
let currentPlayer = null;
let gameActive = false;
let isAiThinking = false;
let gameMode = "pvc"; // "pvp" (Pass & Play) or "pvc" (vs Computer)
let aiDifficulty = "medium"; // "easy", "medium", "hard"

let scores = {
    p1Wins: 0,
    p2Wins: 0,
    draws: 0,
    totalGames: 0
};

// --- Ambient Sweet Flute Audio Engine (Web Audio API) ---
class FluteAudioEngine {
    constructor() {
        this.audioCtx = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.masterGain = null;
        this.delayNode = null;
        this.delayFeedback = null;
        this.timerId = null;
        this.currentNoteIndex = 0;
        
        // Pentatonic peaceful flute frequencies (Hz)
        this.notes = {
            'E4': 329.63,
            'G4': 392.00,
            'A4': 440.00,
            'B4': 493.88,
            'D5': 587.33,
            'E5': 659.25,
            'G5': 783.99,
            'A5': 880.00,
            'B5': 987.77,
            'REST': 0
        };

        // Soothing ambient flute melody composition
        this.melody = [
            { note: 'E5', duration: 1.5 },
            { note: 'G5', duration: 1.0 },
            { note: 'A5', duration: 2.0 },
            { note: 'G5', duration: 1.0 },
            { note: 'E5', duration: 1.5 },
            { note: 'D5', duration: 1.5 },
            { note: 'B4', duration: 2.0 },
            { note: 'REST', duration: 0.5 },
            
            { note: 'D5', duration: 1.0 },
            { note: 'E5', duration: 1.5 },
            { note: 'G5', duration: 1.5 },
            { note: 'A5', duration: 2.5 },
            { note: 'REST', duration: 0.5 },

            { note: 'B5', duration: 1.5 },
            { note: 'A5', duration: 1.0 },
            { note: 'G5', duration: 1.5 },
            { note: 'E5', duration: 1.5 },
            { note: 'D5', duration: 2.0 },
            { note: 'E5', duration: 2.5 },
            { note: 'REST', duration: 0.8 },

            { note: 'G4', duration: 1.5 },
            { note: 'A4', duration: 1.5 },
            { note: 'B4', duration: 1.5 },
            { note: 'D5', duration: 1.5 },
            { note: 'E5', duration: 3.0 },
            { note: 'REST', duration: 1.0 }
        ];
    }

    init() {
        if (this.audioCtx) return;
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtxClass) return;
        this.audioCtx = new AudioCtxClass();
        
        // Master Gain (gentle volume)
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.20, this.audioCtx.currentTime);

        // Echo / Delay effect for spacious ambient flute feel
        this.delayNode = this.audioCtx.createDelay();
        this.delayNode.delayTime.setValueAtTime(0.36, this.audioCtx.currentTime);

        this.delayFeedback = this.audioCtx.createGain();
        this.delayFeedback.gain.setValueAtTime(0.30, this.audioCtx.currentTime);

        const delayFilter = this.audioCtx.createBiquadFilter();
        delayFilter.type = 'lowpass';
        delayFilter.frequency.setValueAtTime(1500, this.audioCtx.currentTime);

        this.delayNode.connect(delayFilter);
        delayFilter.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);

        this.masterGain.connect(this.audioCtx.destination);
        this.delayNode.connect(this.masterGain);
    }

    playFluteNote(freq, duration) {
        if (!this.audioCtx || this.isMuted || freq === 0) return;

        const now = this.audioCtx.currentTime;

        // Primary Sine Oscillator (Fundamental)
        const osc1 = this.audioCtx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);

        // Secondary Soft Overtone
        const osc2 = this.audioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, now);

        const osc2Gain = this.audioCtx.createGain();
        osc2Gain.gain.setValueAtTime(0.08, now);
        osc2.connect(osc2Gain);

        // Expressive Pitch Vibrato (LFO)
        const lfo = this.audioCtx.createOscillator();
        const lfoGain = this.audioCtx.createGain();
        lfo.frequency.setValueAtTime(5.0, now);
        lfoGain.gain.setValueAtTime(freq * 0.01, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);
        lfo.start(now);
        lfo.stop(now + duration + 0.5);

        // Acoustic Breath Noise Effect
        const bufferSize = Math.floor(this.audioCtx.sampleRate * (duration + 0.2));
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const noiseFilter = this.audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1600, now);
        noiseFilter.Q.setValueAtTime(3.5, now);

        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.015, now + 0.1);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        whiteNoise.start(now);
        whiteNoise.stop(now + duration + 0.2);

        // Note Envelope
        const noteGain = this.audioCtx.createGain();
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(0.28, now + 0.15);
        noteGain.gain.setValueAtTime(0.28, now + duration * 0.75);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.35);

        osc1.connect(noteGain);
        osc2Gain.connect(noteGain);
        noiseGain.connect(noteGain);

        noteGain.connect(this.masterGain);
        noteGain.connect(this.delayNode);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration + 0.4);
        osc2.stop(now + duration + 0.4);
    }

    startMelodyLoop() {
        if (this.isPlaying) return;
        this.init();
        if (!this.audioCtx) return;
        
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        this.isPlaying = true;
        this.currentNoteIndex = 0;
        this.scheduleNextNote();
    }

    scheduleNextNote() {
        if (!this.isPlaying) return;
        
        const currentItem = this.melody[this.currentNoteIndex];
        const beatDuration = 0.95;
        const noteDuration = currentItem.duration * beatDuration;

        if (currentItem.note !== 'REST') {
            const freq = this.notes[currentItem.note];
            this.playFluteNote(freq, noteDuration);
        }

        this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;

        this.timerId = setTimeout(() => {
            this.scheduleNextNote();
        }, noteDuration * 1000);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.audioCtx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.20, this.audioCtx.currentTime);
        }
        return this.isMuted;
    }
}

const flutePlayer = new FluteAudioEngine();

// DOM elements
const DOM = {
    registerModal: document.getElementById('register-modal'),
    helpModal: document.getElementById('help-modal'),
    gameoverModal: document.getElementById('gameover-modal'),
    registerForm: document.getElementById('register-form'),
    p1NameInput: document.getElementById('p1-name-input'),
    p2NameInput: document.getElementById('p2-name-input'),
    p2InputGroup: document.getElementById('p2-input-group'),
    turnIndicator: document.getElementById('turn-indicator'),
    turnText: document.getElementById('turn-text'),
    gameBoard: document.getElementById('game-board'),
    cells: document.querySelectorAll('.cell'),
    p1ScoreLabel: document.getElementById('p1-score-label'),
    p2ScoreLabel: document.getElementById('p2-score-label'),
    p1ScoreVal: document.getElementById('p1-score-val'),
    p2ScoreVal: document.getElementById('p2-score-val'),
    drawsScoreVal: document.getElementById('draws-score-val'),
    totalScoreVal: document.getElementById('total-score-val'),
    btnRestart: document.getElementById('btn-restart'),
    btnEditPlayers: document.getElementById('btn-edit-players'),
    btnResetScores: document.getElementById('btn-reset-scores'),
    btnHelp: document.getElementById('btn-help'),
    btnCloseHelp: document.getElementById('btn-close-help'),
    btnNextRound: document.getElementById('btn-next-round'),
    btnMenuClose: document.getElementById('btn-menu-close'),
    btnToggleMusic: document.getElementById('btn-toggle-music'),
    gameoverTitle: document.getElementById('gameover-title'),
    gameoverMessage: document.getElementById('gameover-message'),
    gameoverIcon: document.getElementById('gameover-icon'),
    modeBtns: document.querySelectorAll('.mode-btn'),
    diffBtns: document.querySelectorAll('.diff-btn'),
    difficultyGroup: document.getElementById('difficulty-group'),
    bgCanvas: document.getElementById('bg-canvas'),
    cursorCanvas: document.getElementById('cursor-canvas')
};

// Initialize game
function init() {
    loadScores();
    setupEventListeners();
    setupModeSelectors();
    updateScoreboardUI();
    initBackgroundParticles();
    initCursorEffect();
}

// Mode & Difficulty Setup Controls
function setupModeSelectors() {
    DOM.modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameMode = btn.dataset.mode;

            if (gameMode === 'pvc') {
                DOM.difficultyGroup.classList.remove('hidden');
                DOM.p2NameInput.value = "Computer 🤖";
            } else {
                DOM.difficultyGroup.classList.add('hidden');
                DOM.p2NameInput.value = (player2.name !== "Computer 🤖") ? player2.name : "Player 2";
            }
        });
    });

    DOM.diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.diffBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            aiDifficulty = btn.dataset.diff;
        });
    });
}

// Set up DOM interaction event listeners
function setupEventListeners() {
    DOM.registerForm.addEventListener('submit', handleRegistration);

    DOM.cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    DOM.btnRestart.addEventListener('click', () => startMatch());
    DOM.btnEditPlayers.addEventListener('click', () => openRegistrationModal());
    DOM.btnResetScores.addEventListener('click', resetScores);
    DOM.btnHelp.addEventListener('click', () => openModal(DOM.helpModal));
    DOM.btnCloseHelp.addEventListener('click', () => closeModal(DOM.helpModal));
    DOM.btnNextRound.addEventListener('click', () => {
        closeModal(DOM.gameoverModal);
        startMatch();
    });
    DOM.btnMenuClose.addEventListener('click', () => closeModal(DOM.gameoverModal));

    if (DOM.btnToggleMusic) {
        DOM.btnToggleMusic.addEventListener('click', toggleFluteMusic);
    }

    // Auto-start sweet background flute music on user's first interaction
    const startAudioOnFirstUserAction = () => {
        if (!flutePlayer.isPlaying && !flutePlayer.isMuted) {
            flutePlayer.startMelodyLoop();
        }
        document.removeEventListener('click', startAudioOnFirstUserAction);
        document.removeEventListener('keydown', startAudioOnFirstUserAction);
    };
    document.addEventListener('click', startAudioOnFirstUserAction);
    document.addEventListener('keydown', startAudioOnFirstUserAction);
}

// Toggle background flute tone ON/OFF
function toggleFluteMusic() {
    if (!flutePlayer.audioCtx) {
        flutePlayer.startMelodyLoop();
    }
    const isMuted = flutePlayer.toggleMute();
    if (DOM.btnToggleMusic) {
        const musicIcon = DOM.btnToggleMusic.querySelector('.music-icon');
        const musicText = DOM.btnToggleMusic.querySelector('.music-text');
        
        if (isMuted) {
            DOM.btnToggleMusic.classList.remove('active');
            DOM.btnToggleMusic.classList.add('muted');
            if (musicIcon) musicIcon.textContent = '🔇';
            if (musicText) musicText.textContent = 'Flute Tone: OFF';
        } else {
            DOM.btnToggleMusic.classList.remove('muted');
            DOM.btnToggleMusic.classList.add('active');
            if (musicIcon) musicIcon.textContent = '🎶';
            if (musicText) musicText.textContent = 'Flute Tone: ON';
            if (!flutePlayer.isPlaying) {
                flutePlayer.startMelodyLoop();
            }
        }
    }
}

// Modal helper controls
function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

function openRegistrationModal() {
    DOM.p1NameInput.value = player1.name;
    if (gameMode === 'pvc') {
        DOM.p2NameInput.value = player2.name || "Computer 🤖";
    } else {
        DOM.p2NameInput.value = (player2.name !== "Computer 🤖") ? player2.name : "Player 2";
    }
    openModal(DOM.registerModal);
}

// Handle submitting player names & mode
function handleRegistration(e) {
    e.preventDefault();
    
    const p1Name = DOM.p1NameInput.value.trim() || "Player 1";
    const p2Name = (gameMode === 'pvc') ? "Computer 🤖" : (DOM.p2NameInput.value.trim() || "Player 2");
    
    player1.name = p1Name;
    player2.name = p2Name;
    
    DOM.p1ScoreLabel.innerHTML = `${p1Name} <span class="badge-x">X</span>`;
    DOM.p2ScoreLabel.innerHTML = `${p2Name} <span class="badge-o">O</span>`;
    
    closeModal(DOM.registerModal);
    startMatch();
}

// Start a fresh match
function startMatch() {
    board = Array(9).fill(null);
    currentPlayer = player1;
    gameActive = true;
    isAiThinking = false;

    DOM.cells.forEach(cell => {
        cell.className = 'cell';
        cell.textContent = '';
    });

    updateTurnUI();
}

// Toggle grid hover classes depending on active player
function updateCellHoverIndicator() {
    DOM.cells.forEach(cell => {
        if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
            cell.classList.remove('ghost-x', 'ghost-o');
            if (!isAiThinking && gameActive) {
                const hoverClass = (currentPlayer.symbol === 'X') ? 'ghost-x' : 'ghost-o';
                cell.classList.add(hoverClass);
            }
        }
    });
}

// Synchronizes turn panel colors
function updateTurnUI() {
    if (!gameActive) return;

    DOM.turnText.textContent = `${currentPlayer.name}'s Turn`;
    
    DOM.turnIndicator.classList.remove('active-x', 'active-o');
    const activeClass = (currentPlayer.symbol === 'X') ? 'active-x' : 'active-o';
    DOM.turnIndicator.classList.add(activeClass);
    
    updateCellHoverIndicator();
}

// Handles clicking board positions
function handleCellClick(e) {
    if (!gameActive || isAiThinking) return;
    if (gameMode === 'pvc' && currentPlayer === player2) return;

    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    if (board[index] !== null) return;

    makeMove(index);
}

// Execute move logic
function makeMove(index) {
    board[index] = currentPlayer.symbol;
    
    const cell = DOM.cells[index];
    cell.classList.add(currentPlayer.symbol.toLowerCase());
    cell.textContent = currentPlayer.symbol;
    cell.classList.remove('ghost-x', 'ghost-o');

    const winningCombo = checkWinner(board);
    if (winningCombo) {
        handleGameOver('win', winningCombo);
    } else if (checkDraw(board)) {
        handleGameOver('draw');
    } else {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
        updateTurnUI();

        // Trigger AI turn if vs Computer
        if (gameMode === 'pvc' && currentPlayer === player2 && gameActive) {
            triggerAiMove();
        }
    }
}

// Computer AI Turn Trigger
function triggerAiMove() {
    isAiThinking = true;
    DOM.turnText.textContent = "Computer thinking...";

    setTimeout(() => {
        if (!gameActive) return;
        
        const bestMoveIndex = getBestMove(board, aiDifficulty);
        isAiThinking = false;
        
        if (bestMoveIndex !== null && bestMoveIndex !== undefined) {
            makeMove(bestMoveIndex);
        }
    }, 450);
}

// AI Algorithm Logic (Easy, Medium, Impossible Minimax)
function getBestMove(currentBoard, difficulty) {
    const availableIndices = currentBoard
        .map((val, idx) => (val === null ? idx : null))
        .filter(val => val !== null);

    if (availableIndices.length === 0) return null;

    // Easy: Random move
    if (difficulty === 'easy') {
        return availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }

    // Medium: Smart heuristic (Win if possible, block opponent win, else random 50%)
    if (difficulty === 'medium') {
        // Can Computer win right now?
        for (let i of availableIndices) {
            currentBoard[i] = 'O';
            if (checkWinner(currentBoard)) {
                currentBoard[i] = null;
                return i;
            }
            currentBoard[i] = null;
        }

        // Must block Human from winning right now?
        for (let i of availableIndices) {
            currentBoard[i] = 'X';
            if (checkWinner(currentBoard)) {
                currentBoard[i] = null;
                return i;
            }
            currentBoard[i] = null;
        }

        // Otherwise 50% minimax, 50% random choice
        if (Math.random() < 0.5) {
            return availableIndices[Math.floor(Math.random() * availableIndices.length)];
        }
    }

    // Impossible (Hard): Full Minimax decision tree algorithm
    let bestScore = -Infinity;
    let move = availableIndices[0];

    for (let i of availableIndices) {
        currentBoard[i] = 'O';
        let score = minimax(currentBoard, 0, false);
        currentBoard[i] = null;

        if (score > bestScore) {
            bestScore = score;
            move = i;
        }
    }

    return move;
}

// Minimax algorithm core for Tic-Tac-Toe
function minimax(tempBoard, depth, isMaximizing) {
    const winningCombo = checkWinner(tempBoard);
    if (winningCombo) {
        const winnerSymbol = tempBoard[winningCombo[0]];
        return (winnerSymbol === 'O') ? (10 - depth) : (depth - 10);
    }

    if (checkDraw(tempBoard)) return 0;

    const availableIndices = tempBoard
        .map((val, idx) => (val === null ? idx : null))
        .filter(val => val !== null);

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i of availableIndices) {
            tempBoard[i] = 'O';
            let score = minimax(tempBoard, depth + 1, false);
            tempBoard[i] = null;
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i of availableIndices) {
            tempBoard[i] = 'X';
            let score = minimax(tempBoard, depth + 1, true);
            tempBoard[i] = null;
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
}

// Scans board array for winning matches
function checkWinner(targetBoard) {
    for (const combo of WIN_PATTERNS) {
        const [a, b, c] = combo;
        if (targetBoard[a] && targetBoard[a] === targetBoard[b] && targetBoard[a] === targetBoard[c]) {
            return combo;
        }
    }
    return null;
}

// Check if all spots are filled
function checkDraw(targetBoard) {
    return targetBoard.every(cell => cell !== null);
}

// Game completed outcome handler with Emoji Punch
function handleGameOver(outcome, winningCombo = null) {
    gameActive = false;
    scores.totalGames++;

    // Reset emoji element animation
    if (DOM.gameoverIcon) {
        DOM.gameoverIcon.className = 'trophy-icon';
        void DOM.gameoverIcon.offsetWidth; // force reflow for CSS animation restart
    }

    if (outcome === 'win') {
        winningCombo.forEach(index => {
            DOM.cells[index].classList.add('winner-cell');
        });

        if (gameMode === 'pvc') {
            if (currentPlayer === player1) {
                // Human Player won vs Computer
                scores.p1Wins++;
                DOM.gameoverIcon.textContent = "🥳";
                DOM.gameoverIcon.classList.add('punch-joy');
                DOM.gameoverTitle.textContent = "Victory!";
                DOM.gameoverMessage.innerHTML = `<span style="color: var(--color-p1); font-weight: 700;">${player1.name}</span> defeated the Computer!`;
            } else {
                // Human Player lost to Computer AI
                scores.p2Wins++;
                DOM.gameoverIcon.textContent = "😢";
                DOM.gameoverIcon.classList.add('punch-sad');
                DOM.gameoverTitle.textContent = "Defeat!";
                DOM.gameoverMessage.innerHTML = `<span style="color: var(--color-p2); font-weight: 700;">Computer 🤖</span> won the match! Better luck next time.`;
            }
        } else {
            // PvP Mode Winner
            if (currentPlayer === player1) {
                scores.p1Wins++;
            } else {
                scores.p2Wins++;
            }
            DOM.gameoverIcon.textContent = "🥳";
            DOM.gameoverIcon.classList.add('punch-joy');
            DOM.gameoverTitle.textContent = "Victory!";
            DOM.gameoverMessage.innerHTML = `<span style="color: ${currentPlayer === player1 ? 'var(--color-p1)' : 'var(--color-p2)'}; font-weight: 700;">${currentPlayer.name}</span> Wins the match!`;
        }
    } else {
        // Draw match
        scores.draws++;
        DOM.gameoverIcon.textContent = "🤝";
        DOM.gameoverIcon.classList.add('punch-joy');
        DOM.gameoverTitle.textContent = "Game Draw!";
        DOM.gameoverMessage.textContent = "The board is full. Excellent defense!";
    }

    saveScores();
    updateScoreboardUI();

    setTimeout(() => {
        openModal(DOM.gameoverModal);
    }, 850);
}

// Sync scoreboard counters on the UI
function updateScoreboardUI() {
    DOM.p1ScoreVal.textContent = scores.p1Wins;
    DOM.p2ScoreVal.textContent = scores.p2Wins;
    DOM.drawsScoreVal.textContent = scores.draws;
    DOM.totalScoreVal.textContent = scores.totalGames;
}

// LocalStorage Persistence
function saveScores() {
    localStorage.setItem('tictactoe_scores', JSON.stringify(scores));
}

function loadScores() {
    const saved = localStorage.getItem('tictactoe_scores');
    if (saved) {
        try {
            scores = JSON.parse(saved);
        } catch (e) {
            console.error("Error loading scoreboard statistics", e);
        }
    }
}

// Reset stats back to 0
function resetScores() {
    if (confirm("Are you sure you want to reset all scores?")) {
        scores = { p1Wins: 0, p2Wins: 0, draws: 0, totalGames: 0 };
        saveScores();
        updateScoreboardUI();
    }
}

/* ==========================================================================
   DYNAMIC BACKGROUND NEON PARTICLES CANVAS ENGINE
   ========================================================================== */
function initBackgroundParticles() {
    const canvas = DOM.bgCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const colors = [
        'rgba(255, 59, 105, ',  // Neon Pink/Red
        'rgba(0, 240, 255, ',   // Neon Cyan
        'rgba(124, 77, 255, '   // Neon Violet
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 2.5 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.7;
            this.speedY = (Math.random() - 0.5) * 0.7;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.005;
            if (this.alpha < 0.1) this.alpha = 0.1;
            if (this.alpha > 0.7) this.alpha = 0.7;

            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.shadowBlur = 12;
            ctx.shadowColor = this.color + '0.8)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    const particleCount = Math.min(Math.floor((width * height) / 14000), 70);
    const particles = Array.from({ length: particleCount }, () => new Particle());

    function connectParticles() {
        const maxDist = 130;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const lineAlpha = (1 - dist / maxDist) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124, 77, 255, ${lineAlpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connectParticles();

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   INTERACTIVE CURSOR TRAIL & CLICK BURST CANVAS ENGINE
   ========================================================================== */
function initCursorEffect() {
    const canvas = DOM.cursorCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    let mouse = { x: -100, y: -100 };
    let cursorCircle = { x: -100, y: -100, radius: 10 };
    const trail = [];
    const burstParticles = [];

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Spawn subtle cursor trail particle
        trail.push({
            x: mouse.x,
            y: mouse.y,
            radius: Math.random() * 4 + 2,
            color: Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(255, 59, 105, ',
            alpha: 0.8,
            decay: 0.04
        });

        if (trail.length > 25) trail.shift();
    });

    window.addEventListener('click', (e) => {
        // Trigger click particle explosion
        for (let i = 0; i < 18; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            burstParticles.push({
                x: e.clientX,
                y: e.clientY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 3 + 2,
                color: i % 2 === 0 ? 'rgba(0, 240, 255, ' : 'rgba(255, 59, 105, ',
                alpha: 1,
                decay: 0.03
            });
        }
    });

    function animateCursor() {
        ctx.clearRect(0, 0, width, height);

        // Smooth spring movement towards mouse position
        cursorCircle.x += (mouse.x - cursorCircle.x) * 0.2;
        cursorCircle.y += (mouse.y - cursorCircle.y) * 0.2;

        // Render main glowing cursor ring
        if (mouse.x > 0) {
            ctx.beginPath();
            ctx.arc(cursorCircle.x, cursorCircle.y, 8, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00f0ff';
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Render trailing particles
        for (let i = trail.length - 1; i >= 0; i--) {
            const p = trail[i];
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                trail.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * p.alpha, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.fill();
        }

        // Render click burst particles
        for (let i = burstParticles.length - 1; i >= 0; i--) {
            const bp = burstParticles[i];
            bp.x += bp.vx;
            bp.y += bp.vy;
            bp.alpha -= bp.decay;

            if (bp.alpha <= 0) {
                burstParticles.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(bp.x, bp.y, bp.radius * bp.alpha, 0, Math.PI * 2);
            ctx.fillStyle = bp.color + bp.alpha + ')';
            ctx.shadowBlur = 8;
            ctx.shadowColor = bp.color + '0.8)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}

// Run boot sequence
document.addEventListener('DOMContentLoaded', init);

