// this (400, 400) controls the game's height and width
var width = parseInt(localStorage.getItem("width"));
var height = parseInt(localStorage.getItem("height"));

if(isNaN(width) || isNaN(height)){
  width = localStorage.setItem("width", 400);
  height = localStorage.setItem("height", 400);
  localStorage.setItem("difficulty", 0.5);
}
var width = parseInt(localStorage.getItem("width"));
var height = parseInt(localStorage.getItem("height"));


var game = new Phaser.Game(width, height, Phaser.AUTO, 'gameDiv');
var game_state = {};
var easydim = {width: window.innerWidth, height: window.innerHeight};
// Creates a new 'main' state that wil contain the game
game_state.main = function() {};
game_state.main.prototype = {

    preload: function() {
      // Nothing to see here unless you want to add your own assets
      // Here are some good assets:
      // http://opengameart.org/content/basic-arkanoid-pack
      // http://opengameart.org/content/puzzle-game-art
      // https://www.google.com/search?q=pong+screenshots
      game.load.image('ball', 'assets/googleball.png');
      game.difficulty = 0.5;
      game.difficulty = localStorage.getItem("difficulty");
      var createButton = function(buttonName, numberX, numberY, trigger) {
        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0xFFFFFF);
        this.graphics.drawRect(0, 0, 200, 90);
        this.buttonName = game.add.button(game.world.centerX + numberX, game.world.centerY + numberY, this.graphics.generateTexture(), trigger);
        this.buttonName.anchor.setTo(0.5, 0.5);
        this.buttonText = game.add.text(0,0, buttonName, {font: "16px Arial", fill: "#000000"});
        this.buttonText.anchor.setTo(0.5, 0.5);
        this.buttonName.addChild(this.buttonText);
        this.buttonName.text = this.buttonText;
        this.graphics.destroy();
        return this.buttonName;
      };
      var Options = createButton("Options", 0,-160, function(){
        Options.destroy();
        var resizeWindow = createButton("Resize", 0,-90, function(){
          resizeWindow.destroy();
          difficultyGame.destroy();
          var easyWind = createButton("Easy", 0,-90, function(){
            width = String(easydim.width);
            height = String(easydim.height);
            localStorage.setItem("width", width);
            localStorage.setItem("height", height);
            window.location.reload();
          });
          var hardWin = createButton("Hard", 0,90, function(){
            width = "400";
            height = "400";
            localStorage.setItem("width", width);
            localStorage.setItem("height", height);
            window.location.reload();
          }
          );
        });
        var difficultyGame = createButton("Difficulty", 0,90, function(){
          var easydiff = createButton("Easy", 0,-90, function(){
            localStorage.setItem("difficulty", 0.5);
            window.location.reload();
          });
          var harddiff = createButton("Hard", 0,90, function(){
            localStorage.setItem("difficulty", 2);
            window.location.reload();
          });
        });
      });
    },
    
    create: function() {
      //this is the height and width of the paddle, change if you like
      game.paddleHeight = 30;
      game.paddleWidth = 100;
      // ... keep going!
      var Paddle = function() {
        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0xFFFFFF);
        this.graphics.drawRect(0, 0, game.paddleWidth, game.paddleHeight);
        this.paddle = game.add.sprite(game.width / 2, game.height - (game.paddleHeight / 2 + 5), this.graphics.generateTexture());
        this.paddle.speed = 0;
        this.paddle.anchor.setTo(0.5, 0.5);
        this.graphics.destroy();
        return this.paddle;
      };
      var Ball = function(){
        this.ball = game.add.sprite(game.width / 4 + (game.width / 2 * Math.random()), game.height * .2, 'ball');
        this.ball.anchor.setTo(0.5, 0.5);
        this.ball.velocities = {x: 1 - Math.random() *2, y: 0 };
        return this.ball;
      };
      game.end = function() {
        game.over = true;
        game.paddle.destroy();
        game.ball.destroy();
        game.scoreSprite.fill = 'white';
        setTimeout(function(){
          game.state.start('main');
        }, 3000);
      };
      game.paddle = new Paddle();
      game.ball = new Ball();
      game.score = 0;
      game.scoreSprite = game.add.text(5, 0, game.score.toString());
      game.scoreSprite.fill = 'white';
      game.speed = 0.1;
      game.bounce = -80;
      game.over = false;
      controlCursors = game.input.keyboard.createCursorKeys();
    },

    update: function() {
      // Function called 60 times per second
      if(!game.over){
        if(controlCursors.left.isDown){
          //game.paddle.x -= 5;
          game.paddle.speed -= 1;
        }else if(controlCursors.right.isDown){
          //game.paddle.x += 5;
          game.paddle.speed += 1;
        }
        game.paddle.x += game.paddle.speed;
        game.paddle.speed *= 0.9;
        game.ball.x += game.ball.velocities.x * game.speed;
        game.ball.y += game.ball.velocities.y * game.speed;
        game.ball.velocities.y++;
        if(game.height - game.ball.y < game.paddleHeight){
          if(Math.abs(game.ball.x - game.paddle.x) < game.paddleWidth / 2 + game.ball.width / 2){
            game.ball.velocities.y = game.bounce;
            game.ball.velocities.x += (game.ball.x - game.paddle.x) * game.difficulty;
            game.score++;
            game.scoreSprite.setText(game.score.toString());
          } else{
            game.end();
          }
          if (game.ball.x < 0 || game.ball.x > game.width){
            game.end();
          }
          
        }
        game.ball.angle += game.ball.velocities.x;
      }
      
    },
};

    // Add and start the 'main' state to start the game
    game.state.add('main', game_state.main);
    game.state.start('main');
