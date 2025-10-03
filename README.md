// Game Configuration
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT, // Important: Scale mode for responsiveness
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800, // Define a base resolution 
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let playerPaddle;

function preload() {
    // No assets needed for a simple rectangular Pong
}

function create() {
    // 1. Create the Player Paddle (Left Side)
    // We'll use a physics-enabled rectangle
    playerPaddle = this.add.rectangle(
        50, // x position
        config.scale.height / 2, // y position (center)
        15, // width
        100, // height
        0xFFFFFF // white color
    );
    this.physics.add.existing(playerPaddle, true); // true makes it static

    // 2. Set up Touch/Mouse Input for Mobile Paddle Control
    this.input.on('pointermove', function (pointer) {
        // Limit the paddle's movement to the game area
        playerPaddle.y = Phaser.Math.Clamp(
            pointer.y, 
            playerPaddle.displayHeight / 2, 
            config.scale.height - playerPaddle.displayHeight / 2
        );
    });

    // --- (Additional Pong elements like the ball and opponent AI would go here) ---
    // Example: Create the Ball
    const ball = this.add.circle(400, 300, 10, 0xFFFFFF);
    this.physics.add.existing(ball);
    ball.body.setBounce(1); // Full bounce on collisions
    ball.body.setVelocity(200, 200);
    this.physics.world.checkCollision.left = true;
    this.physics.world.checkCollision.right = true; // Score logic on sides

    // Collision with top/bottom walls
    ball.body.setCollideWorldBounds(true); 

    // Collision with the paddle
    this.physics.add.collider(ball, playerPaddle);
}

function update() {
    // Game loop logic (e.g., checking score, updating AI paddle)
}

