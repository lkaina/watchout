var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.container').append('svg:svg').attr('width', gameOptions.width).attr('height', gameOptions.height);
var scoreBoard = d3.select('span').data(gameStats.score);

var updateScore = function(){
  d3.select('#current-score').text(gameStats.score.toString());
}
var updateBestScore = function(){
  if (currentScore > gameStats.bestScore) {
    d3.select('#best-score').text(currentScore.toString());
    gameStats.bestScore = currentScore;
  }
}

var Player = function(){
  this.path = "m255,212c0,-38.67403 45.19888,-70 101,-70c55.80112,0 101,31.32597 101,70c0,38.67403 -45.19888,70 -101,70c-55.80112,0 -101,-31.32597 -101,-70z"
  this.fill = '#ff6600';

  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 5;

};

Player.prototype.getX = function(){
  //set x position
};
Player.prototype.setX = function(){
  //set x position
};

Player.prototype.getY = function(){
  //set x position
};
Player.prototype.setY = function(){
  //set y position
};

Player.prototype.render = function(){
  //add player to board
};

Player.prototype.dragPlayer = function(){
  //now you can drag player
};

var Enemy = function(){
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 5;
};

Enemy.prototype.detectCollision = function(){
  //detect collision with player
  //if so reset score
};

Enemy.prototype.createEnemies = function(){
  //creates enemies
  //have random x, y positions
};

Enemy.prototype.tween = function(){
  //checks pos of enemy along animated path
  //returns function that takes timesetp argument
  this.x = parseFloat(this.attr('cx'));
  this.y = parseFloat(this.attr('cy'));
};
