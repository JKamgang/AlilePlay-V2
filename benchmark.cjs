const { performance } = require('perf_hooks');

const WIDTH = 10;
const HEIGHT = 20;

const createEmptyBoard = () => Array.from({ length: HEIGHT }, () => Array(WIDTH).fill('0'));

const board = createEmptyBoard();
const player = {
    pos: { x: 4, y: 0 },
    tetromino: [[1, 1, 1, 1]], // 'I'
    shapeKey: 'I'
};

function originalApproach() {
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
    return displayBoard;
}

function surgicalCloneApproach() {
    let displayBoard = board;
    let hasClonedBoard = false;

    player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardY = y + player.pos.y;
                if(board[boardY]) {
                    if (!hasClonedBoard) {
                        displayBoard = [...board];
                        hasClonedBoard = true;
                    }
                    if (displayBoard[boardY] === board[boardY]) {
                        displayBoard[boardY] = [...board[boardY]];
                    }
                    displayBoard[boardY][x + player.pos.x] = player.shapeKey;
                }
            }
        });
    });
    return displayBoard;
}

const ITERATIONS = 100000;

console.log('Running benchmark...');

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    originalApproach();
}
let end = performance.now();
console.log(`Original approach: ${(end - start).toFixed(2)} ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    surgicalCloneApproach();
}
end = performance.now();
console.log(`Surgical clone approach: ${(end - start).toFixed(2)} ms`);
