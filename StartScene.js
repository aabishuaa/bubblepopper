class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Preload assets
        this.load.image('background', 'images/background.png');
        this.load.image('startButton', 'images/startButton.png');
    }

    create() {
        // Add background image and scale it to fit the screen
        const bg = this.add.image(0, 0, 'background').setOrigin(0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;


        // Add start button (positioned lower on the screen)
        const startButton = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height * 0.8, 'startButton')
            .setOrigin(0.5)
            .setInteractive();

        // Add hover effect
        startButton.on('pointerover', () => {
            startButton.setScale(1.1);
            this.input.setDefaultCursor('pointer');
        });

        startButton.on('pointerout', () => {
            startButton.setScale(1);
            this.input.setDefaultCursor('default');
        });

        // Add click event to startButton
        startButton.on('pointerdown', () => {
            console.log('Start Game!');
            this.scene.start('MainGameScene'); // Transition to MainGameScene
        });
    }
}