import { performance } from 'perf_hooks';

// Simulate the placements Map
const numPlacements = 7;
const stringMap = new Map<string, any>();
const numberMap = new Map<number, any>();

for (let i = 0; i < numPlacements; i++) {
    const y = 7;
    const x = 7 + i;
    stringMap.set(`${y},${x}`, { tile: 'A', rackIndex: i });
    numberMap.set(y * 15 + x, { tile: 'A', rackIndex: i });
}

// Benchmark 1: String parsing (Baseline)
const ITERATIONS = 100000;
let stringTime = 0;
let numberTime = 0;

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    const placedCoords = Array.from<string>(stringMap.keys()).map(key => key.split(',').map(Number));
    stringMap.forEach((placement, key) => {
        const [y, x] = key.split(',').map(Number);
    });
}
stringTime = performance.now() - start;

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    const placedCoords = Array.from<number>(numberMap.keys()).map(key => [Math.floor(key / 15), key % 15]);
    numberMap.forEach((placement, key) => {
        const y = Math.floor(key / 15);
        const x = key % 15;
    });
}
numberTime = performance.now() - start;

console.log(`Baseline (String Map): ${stringTime.toFixed(2)}ms`);
console.log(`Optimized (Number Map): ${numberTime.toFixed(2)}ms`);
console.log(`Improvement: ${((stringTime - numberTime) / stringTime * 100).toFixed(2)}%`);
