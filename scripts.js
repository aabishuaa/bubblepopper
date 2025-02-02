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
            // Optionally, control how the scaling is done
            minWidth: 320, // Minimum width to scale to
            minHeight: 480, // Minimum height to scale to
            maxWidth: 1280, // Maximum width for the canvas
            maxHeight: 720, // Maximum height for the canvas
        },
    };

    const game = new Phaser.Game(config);
};
