
let bird;
let brain;
let pipes = [];
let collide = false;
let points = 0;
let earnedPoint = false;
let died = false;
let died2 = false;

let pointsDiv, randDiv;

let u = 0;

function setup() {
  createCanvas(1200, 675);
  bird = new Bird();
  tf.setBackend('cpu');
  brain = new Brain(5);
  reset();
  died = false;
  died2 = false;
  this.shouldUpdate = false;
  update();
  setInterval(function() {
      if(this.shouldUpdate) {
          update();
      }
  }, 0);
  pointDiv = createDiv('');
  randDiv = createDiv('');
  q1 = createDiv('');
  q2 = createDiv('');
  //frameRate(20);
}

function reset() {
    pipes = [];
    for(let i = 0; i < 5; i++) {
        pipes.push(new Pipe(500 + i*500));
    }
    bird.init();
    collide = false;
    died = false;
    died2 = false;
}

function keyPressed() {
    if(key == ' ') bird.jump();
}

function update() {
    shouldUpdate = false;
    let pipesNew = [];
    let addPipe = false;
    maxX = 0;
    for(let pipe of pipes) {
        pipe.update();
        if(pipe.hit(bird)) collide = true;
        if(pipe.x + pipe.w >= 0) pipesNew.push(pipe);
        else addPipe = true;
        if(pipe.x > maxX) maxX = pipe.x;
        if(!pipe.passed && bird.x > pipe.x + pipe.w) {
            pipe.passed = true;
            earnedPoint = true;
            points++;
        }
    }
    if(addPipe) pipesNew.push(new Pipe(maxX + 500));
    pipes = pipesNew;

    bird.update(1.0/60);

    died = collide;
    died2 = bird.y + bird.r > height || bird.y - bird.r < 0;
    brain.process(this, bird, pipes, earnedPoint, died, died2, true);
    earnedPoint = false;

    if(died || died2) reset();
}

function draw() {
  background(0, 170, 255);

  pointDiv.html(points);
  randDiv.html(randthresh);

  for(let pipe of pipes) pipe.draw();
  bird.draw();

}
