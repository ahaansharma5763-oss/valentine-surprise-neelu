const puzzleBoard = document.getElementById('puzzle-board');
const instruction = document.getElementById('puzzle-instruction');

const rows = 3;
const cols = 3;
const size = 100; // 300px / 3
let tiles = [];
const correctOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let isSolved = false;

// Create tiles
function initPuzzle() {
    tiles = [];
    puzzleBoard.innerHTML = '';

    // Create 8 tiles (index 8 is empty)
    for (let i = 0; i < rows * cols; i++) {
        if (i === 8) {
            tiles.push({ val: 8, el: null }); // Empty slot
            continue;
        }

        const tile = document.createElement('div');
        tile.classList.add('puzzle-tile');

        // Background positioning
        const row = Math.floor(i / cols);
        const col = i % cols;
        tile.style.background = `url('assets/image1.jpg')`;
        tile.style.backgroundSize = '300px 300px';
        tile.style.backgroundPosition = `-${col * size}px -${row * size}px`;

        // Store current and target position
        tile.setAttribute('data-val', i);

        // Click event
        tile.addEventListener('click', () => moveTile(i));
        tile.addEventListener('touchstart', (e) => { e.preventDefault(); moveTile(i); });

        puzzleBoard.appendChild(tile);
        tiles.push({ val: i, el: tile });
    }

    shufflePuzzle();
    renderTiles();
}

// Fisher-Yates shuffle but ensuring solvability
function shufflePuzzle() {
    // Simple solvable shuffle: just perform valid random moves
    // Direct random array shuffle can result in unsolvable states
    let currentEmpty = 8;
    const moves = 100; // Number of random moves to scramble

    // Initialize in solved state conceptually
    let state = [...correctOrder];

    for (let k = 0; k < moves; k++) {
        const neighbors = getNeighbors(state.indexOf(8));
        const randomMove = neighbors[Math.floor(Math.random() * neighbors.length)];

        // Swap
        const emptyIdx = state.indexOf(8);
        const tileIdx = state.indexOf(randomMove);

        [state[emptyIdx], state[tileIdx]] = [state[tileIdx], state[emptyIdx]];
    }

    // Apply this state to our tiles array object
    // Re-map tiles based on the shuffled state
    // Actually, it's easier to just re-order the `tiles` array to match `state`
    // `state` contains values 0-8 at indices 0-8.
    // We want `tiles` array to reflect that board state.

    const newTiles = [];
    for (let i = 0; i < 9; i++) {
        const val = state[i];
        const originalTileObj = tiles.find(t => t.val === val);
        newTiles.push(originalTileObj);
    }
    tiles = newTiles;
}

function getNeighbors(index) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const neighbors = [];

    if (row > 0) neighbors.push(index - 3); // Up
    if (row < 2) neighbors.push(index + 3); // Down
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < 2) neighbors.push(index + 1); // Right

    // We actually need to return the VALUES at these indices to know what to swap with?
    // Wait, my state array stores values.
    // So if state is [5, 2, 8...], index 0 is val 5.
    // I need to swap based on current visual position (index in array).

    // Actually, let's keep it simple.
    // We operate on the 'tiles' array which represents the board 0..8
    // neighbors checks valid indices 0..8 adjacent to 'index'

    return neighbors.map(nIdx => {
        // We need the value at that neighbor index in the current `tiles` (or state) setup
        // Actually shuffle logic is abstract, let's just use indices.
        // Wait, the shuffle logic I used above operates on values `state`.
        // `getNeighbors` takes an INDEX and returns adjacent INDICES.
        // `state` maps Index -> Value.
        // So `state.indexOf(8)` is the index of the empty tile.
        // We find neighbors of that index.
        // We pick one neighbor index.
        // We swap values at those indices.
        return tiles[nIdx] ? tiles[nIdx].val : state[nIdx]; // Consistency check
    });
    // This shuffle logic is getting complicated mixing abstract state and object array. 
    // Let's refine `shufflePuzzle` to just swap the object array directly.
}


// Override shuffle with simpler valid-move approach
function shuffleReal() {
    let emptyIdx = tiles.findIndex(t => t.val === 8);
    let lastMove = -1;

    // Reduced to 1: The puzzle will be just ONE click away from being solved.
    for (let i = 0; i < 1; i++) {
        const neighbors = [];
        const r = Math.floor(emptyIdx / 3);
        const c = emptyIdx % 3;

        if (r > 0) neighbors.push(emptyIdx - 3);
        if (r < 2) neighbors.push(emptyIdx + 3);
        if (c > 0) neighbors.push(emptyIdx - 1);
        if (c < 2) neighbors.push(emptyIdx + 1);

        // Don't undo last move immediately to ensure good mixing
        const valid = neighbors.filter(n => n !== lastMove);
        const next = valid[Math.floor(Math.random() * valid.length)];

        // Swap
        [tiles[emptyIdx], tiles[next]] = [tiles[next], tiles[emptyIdx]];
        lastMove = emptyIdx;
        emptyIdx = next;
    }
}


function renderTiles() {
    tiles.forEach((tileObj, index) => {
        if (tileObj.el) {
            const row = Math.floor(index / cols);
            const col = index % cols;
            tileObj.el.style.top = `${row * size}px`;
            tileObj.el.style.left = `${col * size}px`;
            // Ensure appended
            if (!puzzleBoard.contains(tileObj.el)) {
                puzzleBoard.appendChild(tileObj.el);
            }
        }
    });
}

function moveTile(val) {
    if (isSolved) return;

    // Find current index of the clicked value
    const currentIdx = tiles.findIndex(t => t.val === val);
    const emptyIdx = tiles.findIndex(t => t.val === 8);

    const r1 = Math.floor(currentIdx / 3);
    const c1 = currentIdx % 3;
    const r2 = Math.floor(emptyIdx / 3);
    const c2 = emptyIdx % 3;

    // Check adjacency (Manhattan distance === 1)
    const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);

    if (dist === 1) {
        // Swap
        [tiles[currentIdx], tiles[emptyIdx]] = [tiles[emptyIdx], tiles[currentIdx]];
        renderTiles();

        // INSTANT WIN MODE: Automatically solve after 1 move
        setTimeout(forceWin, 200);
    }
}

function checkPuzzleWin() {
    // Check if every tile is in its original index (value === index)
    const win = tiles.every((t, i) => t.val === i);

    if (win) {
        isSolved = true;
        instruction.textContent = "You did it! 💗";

        // Add glow to all tiles
        tiles.forEach(t => {
            if (t.el) t.el.classList.add('correct');
        });

        // Fill the empty slot with the missing piece part if we had one, 
        // but typically we just show the whole image or transition.
        // Let's create the missing piece for visual completeness
        const emptyTileObj = tiles.find(t => t.val === 8);
        const missingTile = document.createElement('div');
        missingTile.classList.add('puzzle-tile', 'correct');
        missingTile.style.background = `url('assets/image1.jpg')`;
        missingTile.style.backgroundSize = '300px 300px';
        missingTile.style.backgroundPosition = `-${2 * size}px -${2 * size}px`;
        missingTile.style.top = `${2 * size}px`;
        missingTile.style.left = `${2 * size}px`;
        missingTile.style.opacity = '0';
        missingTile.style.transition = 'opacity 0.5s';

        puzzleBoard.appendChild(missingTile);

        requestAnimationFrame(() => {
            missingTile.style.opacity = '1';
        });

        setTimeout(() => {
            alertWin();
        }, 1500);
    }
}

function alertWin() {
    // Flash text or something
    instruction.style.textShadow = "0 0 10px #ff6b81";
    setTimeout(() => {
        if (window.nextStage) {
            window.nextStage('stage-1', 'stage-2');
        }
    }, 1000);
}

function forceWin() {
    // Force the array to be sorted
    tiles.sort((a, b) => a.val - b.val);
    renderTiles();
    checkPuzzleWin();
}

// Start
initPuzzle();
// Overwrite the initial sorted tiles with a shuffled set
shuffleReal();
renderTiles();
