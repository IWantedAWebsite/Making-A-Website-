const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const grid = 15;
const paddleHeight = grid * 5; // 75 pixels tall
const maxPaddleY = canvas.height - grid - paddleHeight;

const paddleSpeed = 6;
const ballSpeed = 5;

// --- Game Objects ---

// The left paddle (Player 1)
const leftPaddle = {
    x: grid,
    y: canvas.height / 2 - paddleHeight / 2, 
    width: grid,
    height: paddleHeight,
    dy: 0 // paddle velocity
};

// The right paddle (Player 2)
const rightPaddle = {
    x: canvas.width - grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0
};

// The ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,
    
    // Initial velocity: moves diagonally
    dx: ballSpeed,
    dy: -ballSpeed,
    
    resetting: false
};

// --- Game State ---

let leftScore = 0;
let rightScore = 0;
const winningScore = 5;

// --- Helper Functions ---

// AABB collision detection
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

// Resets the ball after a score
function resetBall(scorer) {
    ball.resetting = true;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // Reverse direction and add a random vertical component
    ball.dx = scorer * ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);

    setTimeout(() => {
        ball.resetting = false;
    }, 1000); // 1 second delay
}

// Displays the winner message
function displayWinner(message) {
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = '40px monospace';
    context.textAlign = 'center';
    context.fillText(message, canvas.width / 2, canvas.height / 2);
    context.font = '20px monospace';
    context.fillText('Refresh to play again', canvas.width / 2, canvas.height / 2 + 40);
}

// --- Main Game Loop ---

function loop() {
    requestAnimationFrame(loop);

    // 1. Clear the canvas
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Paddle Movement & Constraints
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
    leftPaddle.y = Math.max(grid, Math.min(maxPaddleY, leftPaddle.y));
    rightPaddle.y = Math.max(grid, Math.min(maxPaddleY, rightPaddle.y));

    // 3. Ball Movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 4. Ball & Wall Collision (top/bottom)
    if (ball.y < grid || ball.y + ball.height > canvas.height - grid) {
        ball.dy *= -1; 
    }
    
    // 5. Ball & Paddle Collision
    if (collides(ball, leftPaddle)) {
        ball.dx *= -1; 
        ball.x = leftPaddle.x + leftPaddle.width;
    } else if (collides(ball, rightPaddle)) {
        ball.dx *= -1; 
        ball.x = rightPaddle.x - ball.width;
    }

    // 6. Scoring and Reset (left/right walls)
    if (ball.x < 0 && !ball.resetting) {
        rightScore++;
        resetBall(1); 
    } else if (ball.x + ball.width > canvas.width && !ball.resetting) {
        leftScore++;
        resetBall(-1);
    }

    // 7. Draw Elements
    context.fillStyle = 'white';
    // Draw paddles
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    // Draw ball
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    
    // Draw walls and net
    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, canvas.width, grid); // Top wall
    context.fillRect(0, canvas.height - grid, canvas.width, grid); // Bottom wall
    
    // Draw middle dashed line (net)
    for (let i = grid; i < canvas.height - grid; i += grid * 2) {
        context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
    }
    
    // 8. Draw Score
    context.font = '50px monospace';
    context.fillText(leftScore, canvas.width / 2 - 80, 50);
    context.fillText(rightScore, canvas.width / 2 + 50, 50);
    
    // 9. Check for a Winner
    if (leftScore >= winningScore) {
        displayWinner('Player 1 Wins!');
        return; 
    } else if (rightScore >= winningScore) {
        displayWinner('Player 2 Wins!');
        return; 
    }
}

// --- Input Handling (Keyboard) ---

document.addEventListener('keydown', function (e) {
    // Player 1 (Left Paddle): W (up) and S (down)
    if (e.key === 'w') {
        leftPaddle.dy = -paddleSpeed; 
    } else if (e.key === 's') {
        leftPaddle.dy = paddleSpeed; 
    }

    // Player 2 (Right Paddle): Up Arrow (up) and Down Arrow (down)
    if (e.key === 'ArrowUp') {
        rightPaddle.dy = -paddleSpeed; 
    } else if (e.key === 'ArrowDown') {
        rightPaddle.dy = paddleSpeed; 
    }
});

document.addEventListener('keyup', function (e) {
    // Stop Player 1 paddle movement
    if (e.key === 'w' || e.key === 's') {
        leftPaddle.dy = 0;
    }

    // Stop Player 2 paddle movement
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        rightPaddle.dy = 0;
    }
});

// Start the game!
requestAnimationFrame(loop);
