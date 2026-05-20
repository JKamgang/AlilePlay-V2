const { performance } = require('perf_hooks');

const placements = new Map();
// Simulate 7 tiles placed
for (let i = 0; i < 7; i++) {
    placements.set(`${i},${i}`, { tile: 'A', rackIndex: i });
}

function before() {
    const placedRackIndices = new Set(Array.from(placements.values()).map(p => p.rackIndex));
    return placedRackIndices;
}

function after() {
    const placedRackIndices = new Set();
    for (const p of placements.values()) {
        placedRackIndices.add(p.rackIndex);
    }
    return placedRackIndices;
}

const ITERATIONS = 1000000;

let startBefore = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    before();
}
let endBefore = performance.now();
console.log(`Before (Array.from().map()): ${endBefore - startBefore} ms`);

let startAfter = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    after();
}
let endAfter = performance.now();
console.log(`After (for...of): ${endAfter - startAfter} ms`);

console.log(`Improvement: ${(((endBefore - startBefore) - (endAfter - startAfter)) / (endBefore - startBefore) * 100).toFixed(2)}%`);
