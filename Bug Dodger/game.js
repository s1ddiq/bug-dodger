function preload() {
    this.load.image('bug1', 'bug_1.png');
    this.load.image('bug2', 'bug_2.png');
    this.load.image('bug3', 'bug_3.png');
    this.load.image('platform', 'platform.png');
    this.load.image('codey', 'codey.png');
    // this.load.image('bug1', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png')
    // this.load.image('bug2', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png')
    // this.load.image('bug3', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_3.png')
    // this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png')
    // this.load.image('codey', 'https://content.codecademy.com/courses/learn-phaser/physics/codey.png')
    this.load.audio('coin', 'coin.mp3');
  }
  
  const gameState = {
    score: 0
  };
  
  function create() {
    const coin = this.sound.add('coin');
    gameState.player = this.physics.add.sprite(225, 450, 'codey').setScale(.5);
    gameState.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const platforms = this.physics.add.staticGroup();
  
    platforms.create(225, 510, 'platform');
  
    gameState.scoreText = this.add.text(195, 485, 'Score: 0', { fontSize: '15px', fill: '#000000' })
  
    gameState.player.setCollideWorldBounds(true);
  
    this.physics.add.collider(gameState.player, platforms);
    
      gameState.cursors = this.input.keyboard.createCursorKeys();
  
    const bugs = this.physics.add.group();
  
    function bugGen () {
      const xCoord = Math.random() * 450;
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
      gameState.scoreText.setText(`Score: ${gameState.score}`)
    });
    
    this.physics.add.collider(gameState.player, bugs, () => {
      bugGenLoop.destroy();
      this.physics.pause();
      this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
      this.add.text(152, 270, 'Enter to Restart', { fontSize: '15px', fill: '#000000' });
      
          // Add your code below:
        
        
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
  }
  
  const config = {
    type: Phaser.AUTO,
    width: 450,
    height: 500,
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
  