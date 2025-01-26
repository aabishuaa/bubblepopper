window.onload = function () {
    // Phaser configuration
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: '#89cff0',
        scene: [StartScene, MainGameScene], // List of scenes
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
    };

    // Initialize game
    const game = new Phaser.Game(config);
};