import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

interface TetrisGameProps {
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

const WIDTH = 10;
const HEIGHT = 20;

const TETROMINOS = {
  '0': { shape: [[0]], color: 'bg-transparent' },
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
};
type TetrominoKey = keyof typeof TETROMINOS;
const TETROMINO_KEYS = 'IJLOSTZ';

const createEmptyBoard = (): TetrominoKey[][] => Array.from({ length: HEIGHT }, () => Array(WIDTH).fill('0'));

const TetrisGame: React.FC<TetrisGameProps> = ({ t }) => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [player, setPlayer] = useState({ pos: { x: 0, y: 0 }, tetromino: TETROMINOS['I'].shape, shapeKey: 'I' as TetrominoKey, collided: false });
  const [nextTetromino, setNextTetromino] = useState({ shape: TETROMINOS['I'].shape, shapeKey: 'I' as TetrominoKey });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  const randomTetromino = useCallback((): { shape: number[][], shapeKey: TetrominoKey } => {
    const key = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)] as TetrominoKey;
    return { shape: TETROMINOS[key].shape, shapeKey: key };
  }, []);

  const checkCollision = useCallback((p: typeof player, b: TetrominoKey[][], { moveX, moveY }: { moveX: number, moveY: number }): boolean => {
    for (let y = 0; y < p.tetromino.length; y++) {
      for (let x = 0; x < p.tetromino[y].length; x++) {
        if (p.tetromino[y][x] !== 0) {
          const newY = y + p.pos.y + moveY;
          const newX = x + p.pos.x + moveX;
          if (newY >= HEIGHT || newX < 0 || newX >= WIDTH || (b[newY] && b[newY][newX] !== '0')) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const resetPlayer = useCallback(() => {
    const newTetromino = nextTetromino;
    const newNext = randomTetromino();

    setPlayer({
      pos: { x: Math.floor(WIDTH / 2) - 1, y: 0 },
      tetromino: newTetromino.shape,
      shapeKey: newTetromino.shapeKey,
      collided: false,
    });
    setNextTetromino(newNext);

    if (checkCollision({ ...player, pos: { x: Math.floor(WIDTH / 2) - 1, y: 0 }, tetromino: newTetromino.shape }, board, { moveX: 0, moveY: 0 })) {
        setIsGameOver(true);
    }
  }, [nextTetromino, randomTetromino, board, player, checkCollision]);


  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsGameOver(false);
    setNextTetromino(randomTetromino());
    resetPlayer(); // This will use the just-set nextTetromino
  }, [randomTetromino, resetPlayer]);

  useEffect(() => {
    // A one-time setup
    setNextTetromino(randomTetromino());
  }, [randomTetromino]);

  useEffect(() => {
    startGame();
  }, [startGame]);


  const updatePlayerPos = ({ x, y, collided }: { x: number, y: number, collided: boolean }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: prev.pos.x + x, y: prev.pos.y + y },
      collided,
    }));
  };

  const drop = useCallback(() => {
    if (!checkCollision(player, board, { moveX: 0, moveY: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      const newBoard = board.map(row => [...row]);
      player.tetromino.forEach((row, y) => {
          row.forEach((value, x) => {
              if (value !== 0) {
                  newBoard[y + player.pos.y][x] = player.shapeKey;
              }
          });
      });

      let clearedLines = 0;
      const sweptBoard = newBoard.reduce((ack, row) => {
          if (row.every(cell => cell !== '0')) {
              clearedLines++;
              ack.unshift(new Array(WIDTH).fill('0'));
              return ack;
          }
          ack.push(row);
          return ack;
      }, [] as TetrominoKey[][]);

      if (clearedLines > 0) {
          setLines(prev => prev + clearedLines);
          setScore(prev => prev + [0, 40, 100, 300, 1200][clearedLines] * level);
      }
      setBoard(sweptBoard);
      resetPlayer();
    }
  }, [board, player, resetPlayer, checkCollision, level]);

  const movePlayer = useCallback((dir: -1 | 1) => {
    if (!checkCollision(player, board, { moveX: dir, moveY: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  }, [player, board, checkCollision]);

  const playerRotate = useCallback(() => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = clonedPlayer.tetromino[0].map((_, colIndex) => clonedPlayer.tetromino.map(row => row[colIndex]).reverse());

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while(checkCollision(clonedPlayer, board, { moveX: 0, moveY: 0 })) {
        clonedPlayer.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (Math.abs(offset) > clonedPlayer.tetromino[0].length) {
            clonedPlayer.pos.x = pos;
            return;
        }
    }
    setPlayer(clonedPlayer);
  }, [player, board, checkCollision]);

  useEffect(() => {
    if (lines >= level * 10) {
        setLevel(prev => prev + 1);
    }
  }, [lines, level]);

  const dropTime = 1000 / level;
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => drop(), dropTime);
    return () => clearInterval(interval);
  }, [drop, dropTime, isGameOver]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isGameOver) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
        e.preventDefault();
    }
    if (e.key === 'ArrowLeft') movePlayer(-1);
    else if (e.key === 'ArrowRight') movePlayer(1);
    else if (e.key === 'ArrowDown') drop();
    else if (e.key === 'ArrowUp') playerRotate();
  }, [isGameOver, drop, movePlayer, playerRotate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    gameAreaRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const displayBoard = board.map(row => [...row]);
  player.tetromino.forEach((row, y) => {
    row.forEach((value, x) => {
        if (value !== 0) {
            if(displayBoard[y + player.pos.y]) {
                displayBoard[y + player.pos.y][x + player.pos.x] = player.shapeKey;
            }
        }
    });
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-full w-full gap-4 sm:gap-8 text-white p-2 sm:p-4">
      <div className="relative" ref={gameAreaRef} tabIndex={0}>
        <div className="grid grid-cols-10 border-2 border-gray-600 bg-gray-900">
          {displayBoard.map((row, y) =>
            row.map((cell, x) => (
              <div key={`${y}-${x}`} className={`aspect-square w-6 h-6 sm:w-8 sm:h-8 ${TETROMINOS[cell].color} border border-gray-900/50`}/>
            ))
          )}
        </div>
        {isGameOver && (
             <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center">
                <h3 className="text-3xl font-bold text-red-500 mb-4">{t('game_over')}</h3>
                <button onClick={startGame} className="bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded transition-colors">{t('play_again')}</button>
            </div>
        )}
      </div>

      <div className="flex flex-row md:flex-col gap-4">
        {[{label: t('score'), value: score}, {label: t('level'), value: level}, {label: t('lines'), value: lines}].map(item => (
            <div key={item.label} className="bg-gray-800 p-4 rounded-lg text-center w-32">
                <h4 className="font-bold text-base text-gray-400">{item.label}</h4>
                <p className="text-2xl font-mono">{item.value}</p>
            </div>
        ))}
        <div className="bg-gray-800 p-4 rounded-lg text-center w-32">
          <h4 className="font-bold text-base text-gray-400 mb-2">{t('next')}</h4>
          <div className="flex justify-center items-center h-16">
            {nextTetromino && (
                <div className="grid" style={{ gridTemplateColumns: `repeat(${nextTetromino.shape[0].length}, 1fr)`}}>
                     {nextTetromino.shape.map((row, y) =>
                        row.map((cell, x) => (
                            <div key={`${y}-${x}`} className={`w-4 h-4 ${cell ? TETROMINOS[nextTetromino.shapeKey].color : 'opacity-0'}`} />
                        ))
                     )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;