// Simple platformer game using HTML5 Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let player = { 
    x: 100, 
    y: 300, 
    width: 30, 
    height: 30, 
    vx: 0, 
    vy: 0, 
    onGround: false 
};

// Platforms (green) - Easy path with wide platforms
let platforms = [
    { x: 0, y: 570, width: 800, height: 30, color: '#666' }, // Ground
    { x: 150, y: 450, width: 150, height: 20, color: '#0f0' }, // Wide platform
    { x: 350, y: 350, width: 150, height: 20, color: '#0f0' }, // Wide platform
    { x: 550, y: 250, width: 150, height: 20, color: '#0f0' }, // Wide platform
    { x: 250, y: 150, width: 150, height: 20, color: '#0f0' }, // Wide platform
    { x: 450, y: 50, width: 150, height: 20, color: '#0f0' }   // Wide platform near goal
];

// Goal (yellow square to win) - made bigger and easier to reach
let goal = { x: 375, y: 10, width: 80, height: 40, color: '#ff0' };

// Game variables
let keys = {};
let score = 0;
let gameOver = false;
let gameWon = false;
let lives = 10; // Lots of lives!

// Input handling
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyR') resetGame();
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function resetGame() {
    player.x = 100;
    player.y = 300;
    player.vx = 0;
    player.vy = 0;
    score = 0;
    gameOver = false;
    gameWon = false;
    lives = 10;
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function update() {
    if (gameOver || gameWon) return;
    
    // Player movement
    if (keys['ArrowLeft']) player.vx = -5;
    else if (keys['ArrowRight']) player.vx = 5;
    else player.vx *= 0.8;
    
    // Jumping
    if (keys['Space'] && player.onGround) {
        player.vy = -15;
        player.onGround = false;
    }
    
    // Gravity
    player.vy += 0.8;
    
    // Update position
    player.x += player.vx;
    player.y += player.vy;
    
    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x > 770) player.x = 770;
    
    // Check if player fell off screen - but give more chances
    if (player.y > 600) {
        lives--;
        if (lives <= 0) {
            gameOver = true;
        } else {
            // Reset player position
            player.x = 100;
            player.y = 300;
            player.vx = 0;
            player.vy = 0;
        }
    }
    
    // Platform collisions
    player.onGround = false;
    for (let p of platforms) {
        if (checkCollision(player, p)) {
            if (player.vy > 0 && player.y < p.y) {
                player.y = p.y - player.height;
                player.vy = 0;
                player.onGround = true;
            }
        }
    }
    
    // Goal collision (WIN!)
    if (checkCollision(player, goal)) {
        gameWon = true;
    }
    
    // Update score based on height
    score = Math.max(score, Math.floor((600 - player.y) / 10));
}

function draw() {
    // Clear screen
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw platforms
    for (let p of platforms) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
    
    // Draw goal (yellow square) - made bigger
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('GOAL', goal.x + 15, goal.y + 25);
    
    // Draw player (blue square)
    ctx.fillStyle = '#00f';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw UI
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Lives: ' + lives, 10, 60);
    ctx.fillText('Controls: Arrow Keys, Space, R', 10, 570);
    
    // Game over screen
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = '#f00';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 400, 250);
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText('Press R to restart', 400, 300);
        ctx.textAlign = 'left';
    }
    
    // Win screen
    if (gameWon) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = '#0f0';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('YOU WIN! 🎉', 400, 250);
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText('Final Score: ' + score, 400, 300);
        ctx.fillText('Press R to play again', 400, 350);
        ctx.textAlign = 'left';
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop(); 