let game;
let bird;
let brain;
let points = 0;
let earnedPoint = false;

let pointsDiv, randDiv;

let loop;

function setup() {
  createCanvas(1200, 675);
  tf.setBackend('cpu');

  game = new Game();

  bird = new Bird();
  brain = new Brain(3);
  reset();

  this.shouldUpdate = false;
  update();
  loop = setInterval(function() {
      if(this.shouldUpdate) {
          update();
      }
  }, 0);

  pointDiv = createDiv('');
  randDiv = createDiv('');

  frameRate(60);
}

function reset() {
    game.reset();
    bird.init();
}

function keyPressed() {
    if(key == ' ') bird.jump();
    if(key == 'a') {
      clearInterval(loop);
      game.numbirds = 0;
      setInterval(function() { if(this.shouldUpdate) update(); }, 16);
    }
}

function update() {

    shouldUpdate = false;

    bird.update(game.pipes, 1.0/60);
    brain.process(this, bird, game);
    if(game.allDead) reset();

}

function draw() {
  pointDiv.html(points);
  randDiv.html(randthresh);


  game.draw();
  bird.draw(true);
}
