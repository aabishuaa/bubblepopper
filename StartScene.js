class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('background', 'images/background.png');
    }

    create() {
        // Get game dimensions
        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;
    
        // Create and resize background
        this.bg = this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background');
        this.resizeBackground();
    
        // Create a real HTML button
        this.startButton = document.createElement('button');
        this.startButton.innerText = "Start";
        this.startButton.classList.add("start-btn");
        document.body.appendChild(this.startButton);
    
        // Position button where the image button was
        this.positionButton();
    
        // Handle resizing
        this.scale.on('resize', this.resizeGame, this);
    
        // Start game when button is clicked
        this.startButton.addEventListener("click", () => {
            console.log('Start Game!');
            
            // Remove the button from the DOM
            this.startButton.remove();
    
            // Transition to the next scene
            this.scene.start('MainGameScene');
        });
    }
    

    resizeBackground() {
        const scaleX = this.gameWidth / this.bg.width;
        const scaleY = this.gameHeight / this.bg.height;
        const scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale).setPosition(this.gameWidth / 2, this.gameHeight / 2);
    }

    positionButton() {
        this.startButton.style.position = "absolute";
        this.startButton.style.left = `${this.gameWidth / 2}px`;
        this.startButton.style.top = `${this.gameHeight * 0.8}px`;
        this.startButton.style.transform = "translate(-50%, -50%)";
    }

    resizeGame(gameSize) {
        this.gameWidth = gameSize.width;
        this.gameHeight = gameSize.height;

        this.resizeBackground();
        this.positionButton();
    }
}
