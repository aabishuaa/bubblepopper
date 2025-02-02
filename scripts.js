window.onload = function () {
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '#89cff0',
        scene: [StartScene, MainGameScene],
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            minWidth: 320,  // Minimum width to scale to
            minHeight: 480, // Minimum height to scale to
            maxWidth: 1280, // Maximum width for the canvas
            maxHeight: 720, // Maximum height for the canvas
        },
    };

    const game = new Phaser.Game(config);

    // Adjust game scaling after resizing window
    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight);
    });

    // Handle font resizing for responsive text
    Phaser.Text = Phaser.GameObjects.Text;
    Phaser.GameObjects.Text.prototype.setTextSize = function (textSize) {
        const scaleFactor = window.innerWidth / 1280; // adjust based on maxWidth
        const newSize = textSize * scaleFactor;
        this.setFontSize(newSize);
    };
};
