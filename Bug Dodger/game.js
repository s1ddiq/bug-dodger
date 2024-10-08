function preload() {
  this.load.image('bug1', 'bug_1.png');
  this.load.image('bug2', 'bug_2.png');
  this.load.image('bug3', 'bug_3.png');
  this.load.image('platform', 'platform2.png');
  this.load.image('codey', 'codey.png');
  this.load.audio('coin', 'coin.mp3');
}

const gameState = {
  score: 0
};

function create() {
  const coin = this.sound.add('coin');

  // Set Codey's position to be 20% of the window width and 90% of the window height
  gameState.player = this.physics.add.sprite(window.innerWidth * 0.5, window.innerHeight * 0.9, 'codey').setScale(0.5);
  gameState.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

  const platforms = this.physics.add.staticGroup();

  // Platform position relative to the screen
  platforms.create(window.innerWidth * 0.5, window.innerHeight * 0.95, 'platform');

  // Score text, positioned dynamically as well
  gameState.scoreText = this.add.text(0, window.innerHeight * 0.95, 'Score: 0', { fontSize: '25px', fill: '#000000' });
  gameState.scoreText.setOrigin(0.5);
  gameState.scoreText.x = this.cameras.main.width / 2;
  gameState.player.setCollideWorldBounds(true);

  this.physics.add.collider(gameState.player, platforms);
  
  gameState.cursors = this.input.keyboard.createCursorKeys();

  const bugs = this.physics.add.group();

  function bugGen() {
      // Generate bugs at random positions along the width
      const xCoord = Math.random() * window.innerWidth;
      let bugArray = ['bug1', 'bug2', 'bug3'];
      let randomBug = Math.floor(Math.random() * 3);
      bugs.create(xCoord, 10, bugArray[randomBug]);
  }

  const bugGenLoop = this.time.addEvent({
      delay: 100,
      callback: bugGen,
      callbackScope: this,
      loop: true,
  });

  this.physics.add.collider(bugs, platforms, function (bug) {
      bug.destroy();
      gameState.score += 10;
      coin.play();
      gameState.scoreText.setText(`Score: ${gameState.score}`);
  });
  
  this.physics.add.collider(gameState.player, bugs, () => {
      bugGenLoop.destroy();
      this.physics.pause();
      gameState.gameOverText = this.add.text(window.innerWidth * 0.35, window.innerHeight * 0.3, 'Game Over', { fontSize: '30px', fill: '#000000' });
      gameState.restartText = this.add.text(window.innerWidth * 0.28, window.innerHeight * 0.35, 'Click to Restart', { fontSize: '25px', fill: '#000000' });

      gameState.gameOverText.setOrigin(0.5);
  gameState.gameOverText.x = this.cameras.main.width / 2;

  gameState.restartText.setOrigin(0.5);
  gameState.restartText.x = this.cameras.main.width / 2;
  });
}

function update() {
  if (gameState.cursors.left.isDown) {
      gameState.player.setVelocityX(-160);
  } else if (gameState.cursors.right.isDown) {
      gameState.player.setVelocityX(160);
  } else {
      gameState.player.setVelocityX(0);
  }

  if (Phaser.Input.Keyboard.JustDown(gameState.enterKey)) {
      gameState.score = 0;
      this.scene.restart();
  }

  this.input.on('pointermove', (pointer) => {
      const playerX = gameState.player.x;
      const directionX = pointer.x - playerX;
      gameState.player.setVelocityX(directionX);
  });

  this.input.on('pointerup', () => {
      gameState.player.setVelocityX(0);
  });
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
      mode: Phaser.Scale.RESIZE, // Dynamically resize based on window size
      autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game
  },
  backgroundColor: "b9eaff",
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 },
          enableBody: true,
      }
  },
  scene: {
      preload,
      create,
      update
  }
};

const game = new Phaser.Game(config);

// Resize event listener for dynamically resizing the canvas
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
