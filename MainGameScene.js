class MainGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGameScene' });
    }

    preload() {
        this.load.audio('popSound', 'audio/pop.mp3');
        this.load.audio('backgroundMusic', 'audio/background-music.mp3');
        this.load.audio('readyAudio', 'audio/ready.mp3');
        this.load.image('heart', 'images/life.png');
        this.load.image('bubble', 'images/bubble.png');
        this.load.image('bubbleLarge', 'images/bubble.png');
    }

    create() {
        // Initialize high score
        this.highScore = localStorage.getItem('highScore') || 0;

        // Play background music (if not already playing)
        if (!this.backgroundMusic) {
            this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
        }
        this.backgroundMusic.play();

        // Add "Let's Pop Bubbles" text animation
        this.playIntroAnimation();

        // Game variables
        this.score = 0;
        this.lives = 5;
        this.gameOver = false;
        this.spawnInterval = 500; // Faster initial spawn interval (0.5 seconds)
        this.bubbleSpeedFactor = 1; // Speed multiplier for bubbles

        // Create gradient background
        if (!this.textures.exists('gradient')) {
            const gradient = this.textures.createCanvas('gradient', this.sys.game.config.width, this.sys.game.config.height);
            const ctx = gradient.getContext();
            const grd = ctx.createLinearGradient(0, 0, 0, this.sys.game.config.height);
            grd.addColorStop(0, '#f1c3ea');
            grd.addColorStop(0.5, '#e4d4f6');
            grd.addColorStop(1, '#e4d4f6');
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);
            gradient.refresh();
        }

        this.add.image(0, 0, 'gradient').setOrigin(0);

        // Score text
        this.scoreText = this.add.text(this.sys.game.config.width / 2, 60, 'Score: 0', {
            fontFamily: 'Poppins',
            fontSize: '48px',
            color: '#7f347f',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Lives (hearts)
        this.hearts = [];
        for (let i = 0; i < this.lives; i++) {
            const heart = this.add.image(20 + i * 100, 20, 'heart').setScale(0.2).setOrigin(0, 0);
            this.hearts.push(heart);
        }

        // Pause button
        this.pauseButton = this.add.text(this.sys.game.config.width - 60, 50, '⏸', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#7f347f',
        }).setOrigin(0.5).setInteractive();

        this.pauseButton.on('pointerdown', () => {
            this.pauseGame();
        });

        // Resume button (initially hidden)
        this.resumeButton = this.add.text(this.sys.game.config.width - 60, 50, '▶', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#7f347f',
        }).setOrigin(0.5).setInteractive().setVisible(false);

        this.resumeButton.on('pointerdown', () => {
            this.resumeGame();
        });

        // Start spawning bubbles
        this.spawnBubbles();
    }

    playIntroAnimation() {
        // Play the "ready.mp3" audio
        const readyAudio = this.sound.add('readyAudio');
        readyAudio.play();

        const words = ["Ready?", "Let's", "Pop", "Bubbles!"];
        let currentWordIndex = 0;
        let currentText = null;

        const displayWord = () => {
            if (currentWordIndex < words.length) {
                // Remove the previous text (if it exists)
                if (currentText) {
                    currentText.destroy();
                }

                // Display the current word (larger size, Poppins, bold)
                currentText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, words[currentWordIndex], {
                    fontFamily: 'Poppins',
                    fontSize: '92px', // Significantly larger
                    color: '#7f347f',
                    fontStyle: 'bold',
                }).setOrigin(0.5);

                currentWordIndex++;
                this.time.delayedCall(1000, displayWord); // Display next word after 1 second
            } else {
                // Remove the "Bubbles!" text after it's displayed
                this.time.delayedCall(1000, () => {
                    if (currentText) {
                        currentText.destroy();
                    }
                    console.log('Game Starts!');
                });
            }
        };

        displayWord();
    }

    spawnBubbles() {
        this.bubbleSpawnTimer = this.time.addEvent({
            delay: this.spawnInterval,
            callback: () => {
                if (this.gameOver) return;

                const bubbleSizes = [32, 48, 64];
                const bubbleSpeeds = [120, 100, 80].map(speed => speed * this.bubbleSpeedFactor); // Adjust speed
                const bubblePoints = [10, 5, 2];

                const size = Phaser.Math.RND.pick(bubbleSizes);
                const speed = bubbleSpeeds[bubbleSizes.indexOf(size)];
                const points = bubblePoints[bubbleSizes.indexOf(size)];

                const bubble = this.add.image(
                    Phaser.Math.Between(size, this.sys.game.config.width - size),
                    this.sys.game.config.height + size,
                    'bubble'
                )
                    .setScale(size / 64)
                    .setInteractive();

                bubble.popped = false;

                const tween = this.tweens.add({
                    targets: bubble,
                    y: -size,
                    duration: (this.sys.game.config.height + size * 2) / speed * 1000,
                    onComplete: () => {
                        if (!bubble.popped && !this.gameOver) {
                            this.loseLife();
                            bubble.destroy();
                        }
                    },
                });

                bubble.tween = tween; // Store the tween on the bubble object

                bubble.on('pointerdown', () => {
                    if (!this.gameOver && !bubble.popped) {
                        this.popBubble(bubble, points);
                    }
                });
            },
            loop: true,
        });
    }

    popBubble(bubble, points) {
        bubble.popped = true;
        bubble.destroy();
        this.sound.play('popSound');
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);

        // Check for difficulty increase
        this.checkDifficultyIncrease();
    }

    checkDifficultyIncrease() {
        if (this.score % 100 === 0) {
            this.spawnInterval = Math.max(200, this.spawnInterval - 100); // Decrease spawn time, minimum 200ms
            this.bubbleSpeedFactor += 0.1; // Increase speed multiplier
        }
    }

    loseLife() {
        this.lives--;
        if (this.lives >= 0) {
            this.hearts[this.lives].destroy();
        }

        if (this.lives === 0) {
            this.gameOver = true;
            this.showGameOverPopup();
        }
    }

    showGameOverPopup() {
        // Update high score if the current score is higher
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }

        const bg = this.add.rectangle(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            this.sys.game.config.width * 0.8,
            this.sys.game.config.height * 0.6,
            0xffffff,
            0.9
        ).setOrigin(0.5).setStrokeStyle(4, 0x7f347f);

        // Add a large bubble image to the popup
        const bubbleImage = this.add.image(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2 - 250,
            'bubbleLarge'
        ).setScale(0.5);

        this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2 - 150,
            'Game Over!',
            {
                fontFamily: 'Poppins',
                fontSize: '64px',
                color: '#7f347f',
                fontStyle: 'bold',
            }
        ).setOrigin(0.5);

        this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2 - 50,
            `Final Score: ${this.score}`,
            {
                fontFamily: 'Poppins',
                fontSize: '48px',
                color: '#7f347f',
                fontStyle: 'bold',
            }
        ).setOrigin(0.5);

        this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2 + 50,
            `High Score: ${this.highScore}`,
            {
                fontFamily: 'Poppins',
                fontSize: '48px',
                color: '#7f347f',
                fontStyle: 'bold',
            }
        ).setOrigin(0.5);

        const tryAgainButton = this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2 + 150,
            'Try Again',
            {
                fontFamily: 'Poppins',
                fontSize: '48px',
                color: '#ffffff',
                backgroundColor: '#7f347f',
                padding: { x: 20, y: 10 },
                align: 'center',
            }
        ).setOrigin(0.5).setInteractive();

        tryAgainButton.on('pointerdown', () => {
            // Stop and restart the background music
            this.backgroundMusic.stop();
            this.backgroundMusic.play();

            // Restart the scene
            this.scene.restart();
        });
    }

    pauseGame() {
        this.scene.pause();
        this.bubbleSpawnTimer.paused = true; // Pause the bubble spawn timer
        this.tweens.pauseAll(); // Pause all active tweens

        // Hide pause button and show resume button
        this.pauseButton.setVisible(false);
        this.resumeButton.setVisible(true);
    }

    resumeGame() {
        this.scene.resume();
        this.bubbleSpawnTimer.paused = false; // Resume the bubble spawn timer
        this.tweens.resumeAll(); // Resume all active tweens

        // Hide resume button and show pause button
        this.resumeButton.setVisible(false);
        this.pauseButton.setVisible(true);
    }
}