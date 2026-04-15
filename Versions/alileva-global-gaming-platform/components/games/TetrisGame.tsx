import React, { useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from '../../constants';

interface TetrisGameProps {
  t: (key: keyof typeof TRANSLATIONS | string) => string;
}

const WIDTH = 10;
const HEIGHT = 20;

const TETROMINOS = {
  // Fix: Changed key from number 0 to string '0' to ensure all keys are strings for consistent typing.
  '0': { shape: [[0]], color: 'opacity-0' },
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
};
const TETROMINO_KEYS = 'IJLOSTZ';

const createEmptyBoard = (): (keyof typeof TETROMINOS | 0)[][] => Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));

const TetrisGame: React.FC<TetrisGameProps> = ({ t }) => {
  const [board, setBoard] = useState(createEmptyBoard());
  // Fix: Updated state initialization to use string key '0' and corrected type assertion for shapeKey.
  const [player, setPlayer] = useState({ pos: { x: 0, y: 0 }, tetromino: TETROMINOS['0'].shape, shapeKey: '0' as keyof typeof TETROMINOS, collided: false });
  // Fix: Updated state initialization to use string key '0' and corrected type assertion for shapeKey.
  const [nextTetromino, setNextTetromino] = useState({ shape: TETROMINOS['0'].shape, shapeKey: '0' as keyof typeof TETROMINOS });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [dropTime, setDropTime] = useState<number | null>(1000);

  const randomTetromino = useCallback((): { shape: number[][], shapeKey: keyof typeof TETROMINOS } => {
    const key = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)] as keyof typeof TETROMINOS;
    return { shape: TETROMINOS[key].shape, shapeKey: key };
  }, []);

  const resetPlayer = useCallback(() => {
    // Fix: Comparison is now valid as shapeKey is always a string.
    const newTetromino = nextTetromino.shapeKey === '0' ? randomTetromino() : nextTetromino;
    const newNext = randomTetromino();

    setPlayer({
      pos: { x: WIDTH / 2 - 2, y: 0 },
      tetromino: newTetromino.shape,
      shapeKey: newTetromino.shapeKey,
      collided: false,
    });
    setNextTetromino(newNext);

  }, [nextTetromino, randomTetromino]);

  const checkCollision = (p: typeof player, b: typeof board, { moveX, moveY }: { moveX: number, moveY: number }): boolean => {
    for (let y = 0; y < p.tetromino.length; y++) {
      for (let x = 0; x < p.tetromino[y].length; x++) {
        if (p.tetromino[y][x] !== 0) {
          if (
            !b[y + p.pos.y + moveY] ||
            !b[y + p.pos.y + moveY][x + p.pos.x + moveX] ||
            b[y + p.pos.y + moveY][x + p.pos.x + moveX] !== 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const updatePlayerPos = ({ x, y, collided }: { x: number, y: number, collided: boolean }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: prev.pos.x + x, y: prev.pos.y + y },
      collided,
    }));
  };

  const movePlayer = (dir: -1 | 1) => {
    if (!checkCollision(player, board, { moveX: dir, moveY: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const rotate = (matrix: number[][]) => {
    const rotated = matrix.map((_, i) => matrix.map(col => col[i])).reverse();
    return rotated;
  };

  const playerRotate = () => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while(checkCollision(clonedPlayer, board, { moveX: 0, moveY: 0 })) {
        clonedPlayer.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > clonedPlayer.tetromino[0].length) {
            clonedPlayer.pos.x = pos; // reset
            return; // Can't rotate
        }
    }
    setPlayer(clonedPlayer);
  };

  const drop = useCallback(() => {
    if (isGameOver) return;
    if (!checkCollision(player, board, { moveX: 0, moveY: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  }, [board, isGameOver, player]);

  useEffect(() => {
    if (!player.collided) {
        return;
    }

    if (player.pos.y < 1) {
        setIsGameOver(true);
        setDropTime(null);
        return;
    }

    setBoard(prevBoard => {
        const newBoard = prevBoard.map(row => [...row]);
        player.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    newBoard[y + player.pos.y][x] = player.shapeKey;
                }
            });
        });

        let clearedLines = 0;
        const sweptBoard = newBoard.reduce((ack, row) => {
            if (row.every(cell => cell !== 0)) {
                clearedLines++;
                ack.unshift(new Array(WIDTH).fill(0));
                return ack;
            }
            ack.push(row);
            return ack;
        }, [] as typeof board);

        if (clearedLines > 0) {
            setLines(prev => prev + clearedLines);
            setScore(prev => prev + [0, 40, 100, 300, 1200][clearedLines] * level);
        }

        return sweptBoard;
    });

    resetPlayer();

  }, [player.collided, player.pos.y, player.shapeKey, player.tetromino, resetPlayer, level]);


  const startGame = useCallback(() => {
    setIsGameOver(false);
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(1);
    setDropTime(1000);
    const newTetromino = randomTetromino();
    const newNext = randomTetromino();
     setPlayer({
      pos: { x: WIDTH / 2 - 2, y: 0 },
      tetromino: newTetromino.shape,
      shapeKey: newTetromino.shapeKey,
      collided: false,
    });
    setNextTetromino(newNext);
  },[randomTetromino]);

  useEffect(() => {
      startGame();
  }, [startGame]);

  useEffect(() => {
    if (lines > 0 && lines >= level * 10) {
        setLevel(prev => prev + 1);
        setDropTime(1000 / (level + 1) + 200);
    }
  }, [lines, level]);

  useEffect(() => {
    if (dropTime === null) return;
    const gameInterval = setInterval(() => {
      drop();
    }, dropTime);
    return () => clearInterval(gameInterval);
  }, [drop, dropTime]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isGameOver) return;
    if (e.key === 'ArrowLeft') movePlayer(-1);
    else if (e.key === 'ArrowRight') movePlayer(1);
    else if (e.key === 'ArrowDown') drop();
    else if (e.key === 'ArrowUp') playerRotate();
  }, [isGameOver, drop, playerRotate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const displayBoard = board.map(row => [...row]);
  // Fix: Comparison is now valid as shapeKey is always a string.
  if(player.shapeKey !== '0'){
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                displayBoard[y + player.pos.y][x] = player.shapeKey;
            }
        });
      });
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-full w-full gap-4 sm:gap-8 text-white p-2 sm:p-4">
      <div className="relative">
        <div className="grid grid-cols-10 border-2 border-gray-600 bg-gray-900">
          {displayBoard.map((row, y) =>
            row.map((cell, x) => (
              <div key={`${y}-${x}`} className={`aspect-square w-6 h-6 sm:w-8 sm:h-8 ${cell ? TETROMINOS[cell as keyof typeof TETROMINOS].color : 'bg-gray-800'} border border-gray-900/50`}/>
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
        <div className="bg-gray-800 p-4 rounded-lg text-center w-36">
          <h4 className="font-bold text-lg text-gray-400">{t('score')}</h4>
          <p className="text-2xl font-mono">{score}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center w-36">
          <h4 className="font-bold text-lg text-gray-400">{t('level')}</h4>
          <p className="text-2xl font-mono">{level}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center w-36">
          <h4 className="font-bold text-lg text-gray-400">{t('lines')}</h4>
          <p className="text-2xl font-mono">{lines}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center w-36">
          <h4 className="font-bold text-lg text-gray-400 mb-2">{t('next')}</h4>
          <div className="flex justify-center items-center h-16">
            {/* Fix: Comparison is now valid as shapeKey is always a string. */}
            {nextTetromino.shapeKey !== '0' && (
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
