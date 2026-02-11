const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const gameOverModal = document.getElementById('game-over-modal');
const restartBtn = document.getElementById('restart-btn');

// Game Variables
let gameRunning = false;
let score = 0;
let frameId;
let gameSpeed = 5;
let spawnTimer = 0;

// Canvas Size
function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = 300; // Fixed height
}
window.addEventListener('resize', resizeCanvas);

// Assets
const playerImg = new Image();
playerImg.src = 'assets/character.png';
// Fallback if image doesn't load immediately
let playerImgLoaded = false;
playerImg.onload = () => { playerImgLoaded = true; };

// Player Object
const player = {
    x: 50,
    y: 200,
    width: 40,
    height: 40,
    dy: 0,
    jumpStrength: 10,  // Reduced for smoother feeling with lower gravity
    gravity: 0.6,
    grounded: false,

    draw: function () {
        if (playerImgLoaded) {
            ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
        } else {
            // Fallback square
            ctx.fillStyle = '#ff6b81';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    },

    update: function () {
        // Apply gravity
        this.dy += this.gravity;
        this.y += this.dy;

        // Ground collision
        if (this.y + this.height > canvas.height - 10) { // 10px padding for "ground"
            this.y = canvas.height - 10 - this.height;
            this.dy = 0;
            this.grounded = true;
        } else {
            this.grounded = false;
        }
    },

    jump: function () {
        if (this.grounded) {
            this.dy = -this.jumpStrength; // Negative goes up
        }
    }
};

// Obstacles
let obstacles = [];

class Obstacle {
    constructor() {
        this.width = 30;
        this.height = Math.random() > 0.5 ? 25 : 40; // Made shorter (was 40/60)
        this.x = canvas.width;
        this.y = canvas.height - 10 - this.height;
        this.color = '#ff4757';
        this.marked = false; // For scoring
    }

    draw() {
        ctx.fillStyle = this.color;

        // Draw a "pipe" or "heart" shape? Let's do a simple rounded rect
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 5);
        ctx.fill();

        // Add a glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 71, 87, 0.5)";
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
    }

    update() {
        this.x -= gameSpeed;
    }
}

// Input Handling
function handleJump(e) {
    if ((e.code === 'Space' || e.type === 'touchstart' || e.type === 'click') && gameRunning) {
        if (e.type === 'touchstart') e.preventDefault(); // prevent scrolling
        player.jump();
    }
}

document.addEventListener('keydown', handleJump);
canvas.addEventListener('touchstart', handleJump);
canvas.addEventListener('click', handleJump);

restartBtn.addEventListener('click', startGame);

// Game Loop
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

    // Spawn Obstacles
    spawnTimer++;
    if (spawnTimer > 100) { // Approx every 1.5-2 seconds
        obstacles.push(new Obstacle());
        spawnTimer = 0;
        // Increase speed slightly
        if (score % 5 === 0 && score > 0) gameSpeed += 0.2;
    }

    // Update Player
    player.update();
    player.draw();

    // Update Obstacles
    obstacles.forEach((obs, index) => {
        obs.update();
        obs.draw();

        // Collision Detection
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            // Check if we are landing on top (Bounce Mechanic)
            // If player bottom is near obstacle top AND player is falling/stationary
            const overlapY = (player.y + player.height) - obs.y;

            if (overlapY < 15 && player.dy >= 0) {
                // Bounce higher!
                player.dy = -12;
                player.y = obs.y - player.height; // Snap to top so we don't get stuck
            } else {
                gameOver();
            }
        }

        // Scoring
        if (obs.x + obs.width < player.x && !obs.marked) {
            score++;
            scoreEl.textContent = score;
            obs.marked = true;
            checkGameWin();
        }

        // Remove off-screen
        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);
        }
    });

    frameId = requestAnimationFrame(gameLoop);
}

function startGame() {
    resizeCanvas();
    gameRunning = true;
    score = 0;
    gameSpeed = 5;
    spawnTimer = 0;
    obstacles = [];
    scoreEl.textContent = score;
    gameOverModal.classList.add('hidden');

    player.y = canvas.height - 10 - player.height;
    player.dy = 0;

    if (frameId) cancelAnimationFrame(frameId);
    gameLoop();
}
window.startGame = startGame; // Expose to global for script.js

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(frameId);
    gameOverModal.classList.remove('hidden');
}

function checkGameWin() {
    if (score >= 18) {
        gameRunning = false;
        cancelAnimationFrame(frameId);

        // Show success message briefly then transition
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgba(255, 192, 203, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ff6b81";
        ctx.font = "30px 'Nunito'";
        ctx.textAlign = "center";
        ctx.fillText("18 Months of Love! 💗", canvas.width / 2, canvas.height / 2);

        setTimeout(() => {
            if (window.nextStage) {
                window.nextStage('stage-2', 'stage-3');
            }
        }, 2000);
    }
}
