function App() {
  const { useState, useEffect, useRef } = React;

  // ==================== TYPES & CONSTANTS ====================

  const TRANSLATIONS = {
    en: {
      platformName: "Alileva Global Gaming",
      dashboard: "Dashboard",
      backToDashboard: "Back to Dashboard",
      playableGames: "Playable Games",
      comingSoon: "Coming Soon",
      play: "Play",
      leaderboard: "Leaderboard",
      liveChat: "Live Chat",
      sendMessage: "Send message...",
      send: "Send",
      gameOver: "Game Over!",
      score: "Score",
      level: "Level",
      lines: "Lines",
      restart: "Restart",
      difficulty: "Difficulty",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      startGame: "Start Game",
      analyze: "Analyze Word",
      aiCoach: "AI Word Coach",
      basic: "Basic",
      full: "Full",
      detailLevel: "Detail Level",
      yourTiles: "Your Tiles",
      placeWord: "Place Word",
      categories: {
        puzzle: "Puzzle Games",
        board: "Board Games",
        card: "Card Games",
        strategy: "Strategy Games"
      }
    },
    es: {
      platformName: "Alileva Juegos Globales",
      dashboard: "Panel",
      backToDashboard: "Volver al Panel",
      playableGames: "Juegos Jugables",
      comingSoon: "Próximamente",
      play: "Jugar",
      leaderboard: "Tabla de Clasificación",
      liveChat: "Chat en Vivo",
      sendMessage: "Enviar mensaje...",
      send: "Enviar",
      gameOver: "¡Juego Terminado!",
      score: "Puntuación",
      level: "Nivel",
      lines: "Líneas",
      restart: "Reiniciar",
      difficulty: "Dificultad",
      easy: "Fácil",
      medium: "Medio",
      hard: "Difícil",
      startGame: "Comenzar Juego",
      analyze: "Analizar Palabra",
      aiCoach: "Entrenador de Palabras IA",
      basic: "Básico",
      full: "Completo",
      detailLevel: "Nivel de Detalle",
      yourTiles: "Tus Fichas",
      placeWord: "Colocar Palabra",
      categories: {
        puzzle: "Juegos de Rompecabezas",
        board: "Juegos de Mesa",
        card: "Juegos de Cartas",
        strategy: "Juegos de Estrategia"
      }
    },
    fr: {
      platformName: "Alileva Jeux Mondiaux",
      dashboard: "Tableau de Bord",
      backToDashboard: "Retour au Tableau de Bord",
      playableGames: "Jeux Jouables",
      comingSoon: "Bientôt Disponible",
      play: "Jouer",
      leaderboard: "Classement",
      liveChat: "Chat en Direct",
      sendMessage: "Envoyer un message...",
      send: "Envoyer",
      gameOver: "Jeu Terminé!",
      score: "Score",
      level: "Niveau",
      lines: "Lignes",
      restart: "Redémarrer",
      difficulty: "Difficulté",
      easy: "Facile",
      medium: "Moyen",
      hard: "Difficile",
      startGame: "Commencer le Jeu",
      analyze: "Analyser le Mot",
      aiCoach: "Coach de Mots IA",
      basic: "Basique",
      full: "Complet",
      detailLevel: "Niveau de Détail",
      yourTiles: "Vos Tuiles",
      placeWord: "Placer le Mot",
      categories: {
        puzzle: "Jeux de Puzzle",
        board: "Jeux de Plateau",
        card: "Jeux de Cartes",
        strategy: "Jeux de Stratégie"
      }
    },
    zh: {
      platformName: "Alileva 全球游戏",
      dashboard: "仪表板",
      backToDashboard: "返回仪表板",
      playableGames: "可玩游戏",
      comingSoon: "即将推出",
      play: "玩",
      leaderboard: "排行榜",
      liveChat: "实时聊天",
      sendMessage: "发送消息...",
      send: "发送",
      gameOver: "游戏结束！",
      score: "分数",
      level: "等级",
      lines: "行数",
      restart: "重新开始",
      difficulty: "难度",
      easy: "简单",
      medium: "中等",
      hard: "困难",
      startGame: "开始游戏",
      analyze: "分析单词",
      aiCoach: "AI 单词教练",
      basic: "基础",
      full: "完整",
      detailLevel: "详细程度",
      yourTiles: "你的牌",
      placeWord: "放置单词",
      categories: {
        puzzle: "益智游戏",
        board: "棋盘游戏",
        card: "纸牌游戏",
        strategy: "策略游戏"
      }
    }
  };

  const BRAND_COLORS = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    dark: '#0f172a',
    darker: '#020617',
    light: '#1e293b',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  };

  const GAMES_CONFIG = [
    { id: 'tetris', name: 'Tetris', category: 'puzzle', playable: true, icon: '🎮' },
    { id: 'sudoku', name: 'Sudoku', category: 'puzzle', playable: true, icon: '🔢' },
    { id: 'wordmaster', name: 'Word Master', category: 'puzzle', playable: true, icon: '📝' },
    { id: 'chess', name: 'Chess', category: 'board', playable: true, icon: '♟️' },
    { id: 'checkers', name: 'Checkers', category: 'board', playable: true, icon: '⚫' },
    { id: 'ludo', name: 'Ludo', category: 'board', playable: true, icon: '🎲' },
    { id: 'monopoly', name: 'Monopoly', category: 'strategy', playable: true, icon: '🏠' },
    { id: 'poker', name: 'Poker', category: 'card', playable: true, icon: '🃏' },
    { id: 'uno', name: 'UNO', category: 'card', playable: true, icon: '🎴' },
    { id: 'solitaire', name: 'Solitaire', category: 'card', playable: true, icon: '♠️' }
  ];

  // ==================== GAME ENGINES ====================

  // Tetris Engine
  class TetrisEngine {
    constructor() {
      this.width = 10;
      this.height = 20;
      this.board = Array(this.height).fill(null).map(() => Array(this.width).fill(0));
      this.score = 0;
      this.level = 1;
      this.lines = 0;
      this.gameOver = false;
      this.currentPiece = null;
      this.nextPiece = null;

      this.pieces = [
        { shape: [[1,1,1,1]], color: '#00f0f0' }, // I
        { shape: [[1,1],[1,1]], color: '#f0f000' }, // O
        { shape: [[0,1,0],[1,1,1]], color: '#a000f0' }, // T
        { shape: [[1,1,0],[0,1,1]], color: '#00f000' }, // S
        { shape: [[0,1,1],[1,1,0]], color: '#f00000' }, // Z
        { shape: [[1,0,0],[1,1,1]], color: '#0000f0' }, // J
        { shape: [[0,0,1],[1,1,1]], color: '#f0a000' }  // L
      ];

      this.spawnPiece();
    }

    spawnPiece() {
      if (!this.nextPiece) {
        this.nextPiece = this.getRandomPiece();
      }
      this.currentPiece = this.nextPiece;
      this.nextPiece = this.getRandomPiece();
      this.currentPiece.x = Math.floor(this.width / 2) - 1;
      this.currentPiece.y = 0;

      if (this.checkCollision(this.currentPiece)) {
        this.gameOver = true;
      }
    }

    getRandomPiece() {
      const piece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
      return {
        shape: piece.shape.map(row => [...row]),
        color: piece.color,
        x: 0,
        y: 0
      };
    }

    checkCollision(piece) {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = piece.x + x;
            const newY = piece.y + y;
            if (newX < 0 || newX >= this.width || newY >= this.height) {
              return true;
            }
            if (newY >= 0 && this.board[newY][newX]) {
              return true;
            }
          }
        }
      }
      return false;
    }

    move(direction) {
      if (this.gameOver) return false;

      const newPiece = { ...this.currentPiece, x: this.currentPiece.x + direction };
      if (!this.checkCollision(newPiece)) {
        this.currentPiece = newPiece;
        return true;
      }
      return false;
    }

    rotate() {
      if (this.gameOver) return false;

      const rotated = this.currentPiece.shape[0].map((_, i) =>
        this.currentPiece.shape.map(row => row[i]).reverse()
      );

      const newPiece = { ...this.currentPiece, shape: rotated };
      if (!this.checkCollision(newPiece)) {
        this.currentPiece = newPiece;
        return true;
      }
      return false;
    }

    drop() {
      if (this.gameOver) return false;

      const newPiece = { ...this.currentPiece, y: this.currentPiece.y + 1 };
      if (!this.checkCollision(newPiece)) {
        this.currentPiece = newPiece;
        return true;
      } else {
        this.lockPiece();
        this.clearLines();
        this.spawnPiece();
        return false;
      }
    }

    lockPiece() {
      for (let y = 0; y < this.currentPiece.shape.length; y++) {
        for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
          if (this.currentPiece.shape[y][x]) {
            const boardY = this.currentPiece.y + y;
            const boardX = this.currentPiece.x + x;
            if (boardY >= 0) {
              this.board[boardY][boardX] = this.currentPiece.color;
            }
          }
        }
      }
    }

    clearLines() {
      let linesCleared = 0;
      for (let y = this.height - 1; y >= 0; y--) {
        if (this.board[y].every(cell => cell !== 0)) {
          this.board.splice(y, 1);
          this.board.unshift(Array(this.width).fill(0));
          linesCleared++;
          y++;
        }
      }

      if (linesCleared > 0) {
        this.lines += linesCleared;
        this.score += [0, 100, 300, 500, 800][linesCleared] * this.level;
        this.level = Math.floor(this.lines / 10) + 1;
      }
    }

    hardDrop() {
      while (this.drop()) {}
    }

    getState() {
      return {
        board: this.board,
        currentPiece: this.currentPiece,
        nextPiece: this.nextPiece,
        score: this.score,
        level: this.level,
        lines: this.lines,
        gameOver: this.gameOver
      };
    }
  }

  // Sudoku Engine
  class SudokuEngine {
    constructor(difficulty = 'medium') {
      this.size = 9;
      this.solution = this.generateSolution();
      this.puzzle = this.createPuzzle(difficulty);
      this.userBoard = this.puzzle.map(row => [...row]);
    }

    generateSolution() {
      const board = Array(9).fill(null).map(() => Array(9).fill(0));
      this.fillBoard(board);
      return board;
    }

    fillBoard(board, row = 0, col = 0) {
      if (row === 9) return true;
      if (col === 9) return this.fillBoard(board, row + 1, 0);

      const numbers = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);

      for (let num of numbers) {
        if (this.isValid(board, row, col, num)) {
          board[row][col] = num;
          if (this.fillBoard(board, row, col + 1)) return true;
          board[row][col] = 0;
        }
      }
      return false;
    }

    isValid(board, row, col, num) {
      for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
      }

      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[boxRow + i][boxCol + j] === num) return false;
        }
      }
      return true;
    }

    createPuzzle(difficulty) {
      const cellsToRemove = { easy: 30, medium: 45, hard: 55 }[difficulty];
      const puzzle = this.solution.map(row => [...row]);

      let removed = 0;
      while (removed < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
          puzzle[row][col] = 0;
          removed++;
        }
      }
      return puzzle;
    }

    setCell(row, col, value) {
      if (this.puzzle[row][col] === 0) {
        this.userBoard[row][col] = value;
        return this.userBoard[row][col] === this.solution[row][col];
      }
      return false;
    }

    getState() {
      return {
        puzzle: this.puzzle,
        userBoard: this.userBoard,
        solution: this.solution
      };
    }
  }

  // Word Master Engine
  class WordMasterEngine {
    constructor() {
      this.boardSize = 15;
      this.board = Array(this.boardSize).fill(null).map(() =>
        Array(this.boardSize).fill(null)
      );
      this.rack = this.generateRack();
      this.score = 0;
      this.placedWord = '';
    }

    generateRack() {
      const letters = 'AABCDEEFGHIIJKLMNOOPQRSTUUVWXYZ';
      const rack = [];
      for (let i = 0; i < 7; i++) {
        rack.push(letters[Math.floor(Math.random() * letters.length)]);
      }
      return rack;
    }

    placeWord(word, row, col, horizontal = true) {
      this.placedWord = word.toUpperCase();
      for (let i = 0; i < word.length; i++) {
        if (horizontal) {
          this.board[row][col + i] = word[i].toUpperCase();
        } else {
          this.board[row + i][col] = word[i].toUpperCase();
        }
      }
      this.score += word.length * 10;
      this.rack = this.generateRack();
    }

    getState() {
      return {
        board: this.board,
        rack: this.rack,
        score: this.score,
        placedWord: this.placedWord
      };
    }
  }

  // Mock Gemini Service
  const geminiService = {
    analyzeWord: async (word, detailLevel) => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const definitions = {
        'HELLO': 'A greeting or expression of goodwill',
        'WORLD': 'The earth and all its inhabitants',
        'GAME': 'A form of play or sport with rules',
        'WORD': 'A unit of language with meaning'
      };

      const basic = {
        word: word,
        definition: definitions[word] || 'A valid English word',
        points: word.length * 10
      };

      if (detailLevel === 'full') {
        return {
          ...basic,
          synonyms: ['greeting', 'salutation', 'welcome'],
          antonyms: ['goodbye', 'farewell'],
          etymology: 'From Old English origins',
          example: `"${word}" is commonly used in everyday conversation.`
        };
      }

      return basic;
    },

    suggestBestWord: async (tiles) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        word: tiles.slice(0, 5).join(''),
        score: 75,
        position: 'Center row, horizontal'
      };
    },

    moderateMessage: (message) => {
      const aggressive = ['stupid', 'idiot', 'hate', 'kill'];
      return aggressive.some(word => message.toLowerCase().includes(word));
    }
  };

  // ==================== COMPONENTS ====================

  // Tetris Game Component
  const TetrisGame = ({ language, onBack }) => {
    const t = TRANSLATIONS[language];
    const [engine] = useState(() => new TetrisEngine());
    const [gameState, setGameState] = useState(engine.getState());
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        if (!isPaused && !gameState.gameOver) {
          engine.drop();
          setGameState(engine.getState());
        }
      }, Math.max(100, 1000 - (gameState.level - 1) * 100));

      return () => clearInterval(interval);
    }, [isPaused, gameState.gameOver, gameState.level]);

    useEffect(() => {
      const handleKeyPress = (e) => {
        if (gameState.gameOver) return;

        switch(e.key) {
          case 'ArrowLeft':
            engine.move(-1);
            break;
          case 'ArrowRight':
            engine.move(1);
            break;
          case 'ArrowDown':
            engine.drop();
            break;
          case 'ArrowUp':
            engine.rotate();
            break;
          case ' ':
            engine.hardDrop();
            break;
        }
        setGameState(engine.getState());
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState.gameOver]);

    const renderBoard = () => {
      const displayBoard = gameState.board.map(row => [...row]);

      if (gameState.currentPiece) {
        gameState.currentPiece.shape.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell) {
              const boardY = gameState.currentPiece.y + y;
              const boardX = gameState.currentPiece.x + x;
              if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
                displayBoard[boardY][boardX] = gameState.currentPiece.color;
              }
            }
          });
        });
      }

      return displayBoard.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={x}
              className="w-6 h-6 border border-gray-700"
              style={{
                backgroundColor: cell || '#1e293b'
              }}
            />
          ))}
        </div>
      ));
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
        >
          ← {t.backToDashboard}
        </button>

        <div className="flex gap-8 items-start justify-center">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Tetris</h2>
            {renderBoard()}
            {gameState.gameOver && (
              <div className="mt-4 p-4 bg-red-600 rounded-lg text-center">
                <p className="text-xl font-bold">{t.gameOver}</p>
                <button
                  onClick={() => {
                    const newEngine = new TetrisEngine();
                    Object.assign(engine, newEngine);
                    setGameState(engine.getState());
                  }}
                  className="mt-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-200"
                >
                  {t.restart}
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-xl space-y-4">
            <div>
              <p className="text-gray-400">{t.score}</p>
              <p className="text-3xl font-bold">{gameState.score}</p>
            </div>
            <div>
              <p className="text-gray-400">{t.level}</p>
              <p className="text-2xl font-bold">{gameState.level}</p>
            </div>
            <div>
              <p className="text-gray-400">{t.lines}</p>
              <p className="text-2xl font-bold">{gameState.lines}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Next:</p>
              {gameState.nextPiece && (
                <div className="bg-gray-700 p-2 rounded">
                  {gameState.nextPiece.shape.map((row, y) => (
                    <div key={y} className="flex">
                      {row.map((cell, x) => (
                        <div
                          key={x}
                          className="w-4 h-4 border border-gray-600"
                          style={{
                            backgroundColor: cell ? gameState.nextPiece.color : 'transparent'
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-400 mt-4">
              <p>← → : Move</p>
              <p>↑ : Rotate</p>
              <p>↓ : Soft Drop</p>
              <p>Space : Hard Drop</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sudoku Game Component
  const SudokuGame = ({ language, onBack }) => {
    const t = TRANSLATIONS[language];
    const [difficulty, setDifficulty] = useState(null);
    const [engine, setEngine] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);

    const startGame = (diff) => {
      const newEngine = new SudokuEngine(diff);
      setEngine(newEngine);
      setGameState(newEngine.getState());
      setDifficulty(diff);
    };

    const handleCellClick = (row, col) => {
      if (gameState.puzzle[row][col] === 0) {
        setSelectedCell({ row, col });
      }
    };

    const handleNumberInput = (num) => {
      if (selectedCell && engine) {
        const isCorrect = engine.setCell(selectedCell.row, selectedCell.col, num);
        setGameState(engine.getState());
        if (!isCorrect) {
          setTimeout(() => {
            engine.setCell(selectedCell.row, selectedCell.col, 0);
            setGameState(engine.getState());
          }, 500);
        }
      }
    };

    if (!difficulty) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
          <button
            onClick={onBack}
            className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
          >
            ← {t.backToDashboard}
          </button>

          <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-center">Sudoku</h2>
            <p className="text-gray-400 mb-6 text-center">{t.difficulty}</p>
            <div className="space-y-3">
              {['easy', 'medium', 'hard'].map(diff => (
                <button
                  key={diff}
                  onClick={() => startGame(diff)}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition text-lg font-semibold"
                >
                  {t[diff]}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
        >
          ← {t.backToDashboard}
        </button>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Sudoku - {t[difficulty]}</h2>

          <div className="bg-gray-800 p-6 rounded-xl inline-block">
            <div className="grid grid-cols-9 gap-0">
              {gameState.userBoard.map((row, rowIdx) =>
                row.map((cell, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    className={`
                      w-12 h-12 flex items-center justify-center border cursor-pointer
                      ${(rowIdx + 1) % 3 === 0 ? 'border-b-2' : 'border-b'}
                      ${(colIdx + 1) % 3 === 0 ? 'border-r-2' : 'border-r'}
                      ${gameState.puzzle[rowIdx][colIdx] !== 0 ? 'bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'}
                      ${selectedCell?.row === rowIdx && selectedCell?.col === colIdx ? 'bg-indigo-600' : ''}
                      ${cell !== 0 && cell !== gameState.solution[rowIdx][colIdx] ? 'text-red-500' : 'text-white'}
                    `}
                  >
                    {cell !== 0 ? cell : ''}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-2 justify-center">
            {[1,2,3,4,5,6,7,8,9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xl font-bold"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Word Master Game Component
  const WordMasterGame = ({ language, onBack }) => {
    const t = TRANSLATIONS[language];
    const [engine] = useState(() => new WordMasterEngine());
    const [gameState, setGameState] = useState(engine.getState());
    const [wordInput, setWordInput] = useState('');
    const [detailLevel, setDetailLevel] = useState('basic');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePlaceWord = () => {
      if (wordInput.length > 0) {
        engine.placeWord(wordInput, 7, 7, true);
        setGameState(engine.getState());
        setWordInput('');
      }
    };

    const handleAnalyze = async () => {
      if (gameState.placedWord) {
        setLoading(true);
        const result = await geminiService.analyzeWord(gameState.placedWord, detailLevel);
        setAnalysis(result);
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-pink-900 to-gray-900 p-8">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
        >
          ← {t.backToDashboard}
        </button>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Word Master</h2>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="grid grid-cols-15 gap-0">
                {gameState.board.map((row, y) => (
                  <React.Fragment key={y}>
                    {row.map((cell, x) => (
                      <div
                        key={`${y}-${x}`}
                        className="w-8 h-8 border border-gray-700 flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: cell ? '#6366f1' : '#1e293b'
                        }}
                      >
                        {cell}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-gray-400 mb-2">{t.yourTiles}</p>
                <div className="flex gap-2">
                  {gameState.rack.map((letter, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 bg-yellow-600 rounded flex items-center justify-center text-xl font-bold"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value.toUpperCase())}
                  placeholder="Enter word..."
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg"
                />
                <button
                  onClick={handlePlaceWord}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  {t.placeWord}
                </button>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold">{t.score}: {gameState.score}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">{t.aiCoach}</h3>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">{t.detailLevel}</label>
                <select
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                >
                  <option value="basic">{t.basic}</option>
                  <option value="full">{t.full}</option>
                </select>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!gameState.placedWord || loading}
                className="w-full px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : t.analyze}
              </button>

              {analysis && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg space-y-2">
                  <p className="text-xl font-bold">{analysis.word}</p>
                  <p className="text-gray-300">{analysis.definition}</p>
                  <p className="text-green-400">Points: {analysis.points}</p>

                  {analysis.synonyms && (
                    <div>
                      <p className="text-gray-400 text-sm">Synonyms:</p>
                      <p className="text-gray-300">{analysis.synonyms.join(', ')}</p>
                    </div>
                  )}

                  {analysis.etymology && (
                    <div>
                      <p className="text-gray-400 text-sm">Etymology:</p>
                      <p className="text-gray-300">{analysis.etymology}</p>
                    </div>
                  )}

                  {analysis.example && (
                    <div>
                      <p className="text-gray-400 text-sm">Example:</p>
                      <p className="text-gray-300 italic">{analysis.example}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Static Board Game Component (Chess, Checkers, Ludo, Monopoly)
  const StaticBoardGame = ({ game, language, onBack }) => {
    const t = TRANSLATIONS[language];
    const [draggedPiece, setDraggedPiece] = useState(null);

    const renderChessBoard = () => (
      <div className="grid grid-cols-8 gap-0 w-96 h-96">
        {Array(64).fill(null).map((_, idx) => {
          const row = Math.floor(idx / 8);
          const col = idx % 8;
          const isLight = (row + col) % 2 === 0;
          const piece = row < 2 || row > 5 ? '♟' : null;

          return (
            <div
              key={idx}
              className={`flex items-center justify-center text-4xl cursor-pointer ${
                isLight ? 'bg-amber-200' : 'bg-amber-700'
              }`}
              draggable={!!piece}
              onDragStart={() => setDraggedPiece(idx)}
            >
              {piece}
            </div>
          );
        })}
      </div>
    );

    const renderCheckersBoard = () => (
      <div className="grid grid-cols-8 gap-0 w-96 h-96">
        {Array(64).fill(null).map((_, idx) => {
          const row = Math.floor(idx / 8);
          const col = idx % 8;
          const isDark = (row + col) % 2 === 1;
          const hasPiece = isDark && (row < 3 || row > 4);

          return (
            <div
              key={idx}
              className={`flex items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-300'
              }`}
            >
              {hasPiece && (
                <div className={`w-10 h-10 rounded-full ${row < 3 ? 'bg-red-600' : 'bg-black'}`} />
              )}
            </div>
          );
        })}
      </div>
    );

    const renderLudoBoard = () => (
      <div className="w-96 h-96 bg-white relative">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-red-500" />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-500" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-yellow-500" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-500" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white border-4 border-gray-800 rounded-full" />
      </div>
    );

    const renderMonopolyBoard = () => (
      <div className="w-96 h-96 bg-green-100 border-8 border-gray-800 relative">
        <div className="absolute top-0 left-0 right-0 h-12 bg-white border-b-2 border-gray-800 flex">
          {Array(9).fill(null).map((_, i) => (
            <div key={i} className="flex-1 border-r border-gray-400" />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white border-t-2 border-gray-800 flex">
          {Array(9).fill(null).map((_, i) => (
            <div key={i} className="flex-1 border-r border-gray-400" />
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-white border-r-2 border-gray-800" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-white border-l-2 border-gray-800" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-red-600">
          MONOPOLY
        </div>
      </div>
    );

    const boards = {
      chess: renderChessBoard,
      checkers: renderCheckersBoard,
      ludo: renderLudoBoard,
      monopoly: renderMonopolyBoard
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-8">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
        >
          ← {t.backToDashboard}
        </button>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{game.name}</h2>
          <div className="inline-block bg-gray-800 p-8 rounded-xl">
            {boards[game.id]()}
          </div>
          <p className="mt-6 text-gray-400">Drag pieces to move them around the board</p>
        </div>
      </div>
    );
  };

  // Card Game Component (Poker, UNO, Solitaire)
  const CardGame = ({ game, language, onBack }) => {
    const t = TRANSLATIONS[language];
    const [hand, setHand] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
      generateHand();
    }, []);

    const generateHand = () => {
      const suits = ['♠', '♥', '♦', '♣'];
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const newHand = [];

      for (let i = 0; i < 7; i++) {
        if (game.id === 'uno') {
          const colors = ['red', 'blue', 'green', 'yellow'];
          newHand.push({
            value: Math.floor(Math.random() * 10),
            color: colors[Math.floor(Math.random() * colors.length)]
          });
        } else {
          newHand.push({
            suit: suits[Math.floor(Math.random() * suits.length)],
            value: values[Math.floor(Math.random() * values.length)]
          });
        }
      }
      setHand(newHand);
    };

    const renderCard = (card, idx) => {
      if (game.id === 'uno') {
        return (
          <div
            key={idx}
            onClick={() => setSelectedCard(idx)}
            className={`w-24 h-36 rounded-lg flex items-center justify-center text-3xl font-bold cursor-pointer transform transition ${
              selectedCard === idx ? 'scale-110 -translate-y-4' : ''
            }`}
            style={{ backgroundColor: card.color }}
          >
            {card.value}
          </div>
        );
      }

      const isRed = card.suit === '♥' || card.suit === '♦';
      return (
        <div
          key={idx}
          onClick={() => setSelectedCard(idx)}
          className={`w-24 h-36 bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer transform transition ${
            selectedCard === idx ? 'scale-110 -translate-y-4' : ''
          }`}
        >
          <span className={`text-3xl ${isRed ? 'text-red-600' : 'text-black'}`}>
            {card.suit}
          </span>
          <span className={`text-2xl font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
            {card.value}
          </span>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
        >
          ← {t.backToDashboard}
        </button>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{game.name}</h2>

          <div className="bg-gray-800 p-8 rounded-xl min-h-96 flex items-center justify-center">
            <div className="flex gap-4">
              {hand.map((card, idx) => renderCard(card, idx))}
            </div>
          </div>

          <button
            onClick={generateHand}
            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            Deal New Hand
          </button>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = ({ language, onSelectGame }) => {
    const t = TRANSLATIONS[language];
    const [messages, setMessages] = useState([
      { user: 'AI Crew', text: 'Welcome to Alileva Gaming! 🎮', time: '10:00' }
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const leaderboard = [
      { rank: 1, name: 'Player1', score: 15420 },
      { rank: 2, name: 'Player2', score: 14890 },
      { rank: 3, name: 'Player3', score: 13560 },
      { rank: 4, name: 'Player4', score: 12340 },
      { rank: 5, name: 'Player5', score: 11200 }
    ];

    const handleSendMessage = () => {
      if (inputMessage.trim()) {
        const isFlagged = geminiService.moderateMessage(inputMessage);

        if (isFlagged) {
          setMessages([...messages,
            { user: 'You', text: inputMessage, time: new Date().toLocaleTimeString().slice(0, 5) },
            { user: 'AI Moderator', text: '⚠️ Message flagged for review', time: new Date().toLocaleTimeString().slice(0, 5), warning: true }
          ]);
        } else {
          setMessages([...messages,
            { user: 'You', text: inputMessage, time: new Date().toLocaleTimeString().slice(0, 5) }
          ]);
        }
        setInputMessage('');
      }
    };

    const gamesByCategory = GAMES_CONFIG.reduce((acc, game) => {
      if (!acc[game.category]) acc[game.category] = [];
      acc[game.category].push(game);
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t.platformName}
          </h1>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              {Object.entries(gamesByCategory).map(([category, games]) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold mb-4">{t.categories[category]}</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {games.map(game => (
                      <div
                        key={game.id}
                        className={`bg-gray-800 p-6 rounded-xl transition transform hover:scale-105 ${
                          game.playable ? 'cursor-pointer hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => game.playable && onSelectGame(game)}
                      >
                        <div className="text-4xl mb-2">{game.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          game.playable ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {game.playable ? t.playableGames : t.comingSoon}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">{t.leaderboard}</h3>
                <div className="space-y-2">
                  {leaderboard.map(player => (
                    <div key={player.rank} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          player.rank === 1 ? 'bg-yellow-500' : player.rank === 2 ? 'bg-gray-400' : player.rank === 3 ? 'bg-amber-700' : 'bg-gray-600'
                        }`}>
                          {player.rank}
                        </span>
                        <span>{player.name}</span>
                      </div>
                      <span className="font-bold text-indigo-400">{player.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">{t.liveChat}</h3>
                <div className="h-64 overflow-y-auto mb-4 space-y-2">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`p-2 rounded ${msg.warning ? 'bg-red-900' : 'bg-gray-700'}`}>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span className="font-bold">{msg.user}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t.sendMessage}
                    className="flex-1 px-4 py-2 bg-gray-700 rounded-lg"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    {t.send}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main App Component
  const [language, setLanguage] = useState('en');
  const [selectedGame, setSelectedGame] = useState(null);

  const renderGame = () => {
    if (!selectedGame) return null;

    const gameProps = {
      language,
      onBack: () => setSelectedGame(null)
    };

    switch(selectedGame.id) {
      case 'tetris':
        return <TetrisGame {...gameProps} />;
      case 'sudoku':
        return <SudokuGame {...gameProps} />;
      case 'wordmaster':
        return <WordMasterGame {...gameProps} />;
      case 'chess':
      case 'checkers':
      case 'ludo':
      case 'monopoly':
        return <StaticBoardGame game={selectedGame} {...gameProps} />;
      case 'poker':
      case 'uno':
      case 'solitaire':
        return <CardGame game={selectedGame} {...gameProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="fixed top-4 right-4 z-50">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="zh">中文</option>
        </select>
      </div>

      {selectedGame ? renderGame() : <Dashboard language={language} onSelectGame={setSelectedGame} />}
    </div>
  );
}