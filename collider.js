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

var gameBoard = d3.select('.container').append('svg').attr('width', gameOptions.width).attr('height', gameOptions.height);
// var scoreBoard = d3.select('span').data(gameStats.score);

var updateScore = function(){
  d3.select('#current-score').text(gameStats.score.toString());
};

var updateBestScore = function(){
  if (currentScore > gameStats.bestScore) {
    d3.select('#best-score').text(currentScore.toString());
    gameStats.bestScore = currentScore;
  }
};

var Player = function(gameOptions){
  // this.path = "m255,212c0,-38.67403 45.19888,-70 101,-70c55.80112,0 101,31.32597 101,70c0,38.67403 -45.19888,70 -101,70c-55.80112,0 -101,-31.32597 -101,-70z";
  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  this.fill = '#ff6600';

  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 5;

  this.playerNode = null;

  this.gameOptions = gameOptions;

};

Player.prototype.getX = function(){
  return this.x;
};

Player.prototype.setX = function(x){
  var minX = this.gameOptions.padding;
  var maxX = this.gameOptions.width - this.gameOptions.padding;
  if (x <= minX){
    x = minX;
  }
  if (x >= maxX){
    x = maxX;
  }
  this.x = x;
};

Player.prototype.getY = function(){
  return this.y;
};

Player.prototype.setY = function(y){
  var minY = this.gameOptions.padding;
  var maxY = this.gameOptions.height - this.gameOptions.padding;
  if (y <= minY){
    y = minY;
  }
  if (y >= maxY){
    y = maxY;
  }
  this.y = y;
};

Player.prototype.render = function(gameBoard){
  //add player to board
  this.playerNode = gameBoard.append('path').attr('d', this.path).attr('fill', this.fill);
  this.transform({x:(this.gameOptions.width*0.5), y:this.gameOptions.height*0.5});
  this.dragPlayer();
};

Player.prototype.dragPlayer = function(){
  var player = this;
  var dragCB = function(){
    player.moveRelative(d3.event.dx, d3.event.dy);
  };
  var drag = d3.behavior.drag().on('drag', dragCB);
  player.playerNode.call(drag);
};

Player.prototype.transform = function(opts){
  this.angle = opts.angle || this.angle;
  this.setX(opts.x || this.x);
  this.setY(opts.y || this.y);
  this.playerNode.attr('transform', 'rotate('+this.angle+', '+this.getX()+', '+this.getY()+') translate('+this.getX()+', '+this.getY()+')');
};

Player.prototype.moveAbsolute = function(x, y){
  this.transform({x:x, y:y});
};

Player.prototype.moveRelative = function(dx, dy){
  var newX = this.setX(this.getX()+dx);
  var newY = this.setY(this.getY()+dy);
  var newAngle = 360 * (Math.atan2(dy,dx)/(Math.PI*2));
  this.transform({x:newX, y:newY, angle:newAngle});
};


var newPlayer = new Player(gameOptions).render(gameBoard);

var Enemy = function(gameOptions){
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 5;
  this.gameOptions = gameOptions;
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

Enemy.prototype.render = function(){
  this.enemyNode = gameBoard.append('path').attr('d', this.path).attr('fill', this.fill);
  this.transform({x:(this.gameOptions.width*0.5), y:this.gameOptions.height*0.5});
  this.dragPlayer();
};
