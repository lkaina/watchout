
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

var updateScore = function(){
  return d3.select('.current-score').text(gameStats.score.toString());
};

var updateBestScore = function(){
  if (gameStats.score > gameStats.bestScore) {
    gameStats.bestScore = gameStats.score;
    return d3.select('.best-score').text(gameStats.score.toString());
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

Player.prototype.render = function(gameBoard){
  this.playerNode = gameBoard.append('path').attr('d', this.path).attr('fill', this.fill);
  this.transform({x:(this.gameOptions.width*0.5), y:this.gameOptions.height*0.5});
  this.dragPlayer();
  return this;
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

Player.prototype.dragPlayer = function(){
  var player = this;
  var dragCB = function(){
    return player.moveRelative(d3.event.dx, d3.event.dy);
  };
  var drag = d3.behavior.drag().on('drag', dragCB);
  return player.playerNode.call(drag);
};

Player.prototype.transform = function(opts){
  this.angle = opts.angle || this.angle;
  this.setX(opts.x || this.x);
  this.setY(opts.y || this.y);
  this.playerNode.attr('transform', 'rotate('+this.angle+', '+this.getX()+', '+this.getY()+') translate('+this.getX()+', '+this.getY()+')');
};

Player.prototype.moveAbsolute = function(x, y){
  return this.transform({x:x, y:y});
};

Player.prototype.moveRelative = function(dx, dy){
  var newX = this.getX()+dx;
  var newY = this.getY()+dy;
  var newAngle = 360 * (Math.atan2(dy,dx)/(Math.PI*2));
  return this.transform({x:newX, y:newY, angle:newAngle});
};
// debugger;
var newPlayer = new Player(gameOptions).render(gameBoard);

var enemyPath = "m234,103.5c0,-4.69614 4.02762,-8.5 9,-8.5c4.97238,0 9,3.80386 9,8.5c0,4.69613 -4.02762,8.5 -9,8.5c-4.97238,0 -9,-3.80387 -9,-8.5z";
var enemyFill = '#ff00ff';

var createEnemies = function(){
  return _.map(_.range(0, gameOptions.nEnemies), function(i){
    return {id: i, x: Math.random()*100, y: Math.random()*100};
  });
};

var render = function(enemyData){
  // debugger;
  var enemies = gameBoard.selectAll('circle.enemy').data(enemyData, function(d){return d.id;});
  enemies.enter().append('circle').attr('class', 'enemy').attr('cx', function(enemy){
    return axes.x(enemy.x);
  }).attr('cy', function(enemy){
    return axes.y(enemy.y);
  }).attr('r', 10);

  enemies.exit().remove();

  var detectCollision = function(enemy, callBack){
    var xDiff = parseFloat(enemy.attr('cx')) - newPlayer.x;
    var yDiff = parseFloat(enemy.attr('cy')) - newPlayer.y;
    var radiiSum = parseFloat(enemy.attr('r')) + newPlayer.r;

    var distance = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2))-radiiSum;
    if (distance <= 0){
      return callBack(newPlayer, enemy);
    }
  };

  var onCollision = function(){
    updateBestScore();
    gameStats.score = 0;
    return updateScore();
  };

  var tweenCollision = function(endData){
    // debugger;

    var enemy = d3.select(this);
    debugger;
    console.log(enemy.attr.id);
    var startPos = {x:parseFloat(enemy.attr('cx')),y:parseFloat(enemy.attr('cy'))};
    var endPos = {x:axes.x(endData.x),y:axes.y(endData.y)};
    console.log('start: ',startPos.x, startPos.y);
    console.log('end: ',endPos.x, endPos.y);
    return function(t){
      detectCollision(enemy, onCollision);
      var enemyNextPos = {x:startPos.x + t*(endPos.x - startPos.x), y:startPos.y + t*(endPos.y - startPos.y)};
      return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
    };
  };
  // transition().duration(500).attr('r', 10)
  return enemies.transition().duration(2000).tween('custom', tweenCollision);
};

var startGame = function(){
  var turn = function(){
    var enemyData = createEnemies();
    return render(enemyData);
  };

  var changeScore = function(){
    gameStats.score += 1;
    return updateScore();
  };

  turn();
  setInterval(turn, 2000);
  return setInterval(changeScore, 50);
};

startGame();











































