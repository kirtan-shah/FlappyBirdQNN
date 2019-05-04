
let birds = [];
let brain;
let pipes = [];
let points = 0;
let earnedPoint = false;
let died = false;

let pointsDiv, randDiv;

let u = 0;



function setup() {
  createCanvas(1200, 675);
  tf.setBackend('cpu');

  for(let i = 0; i < 50; i++) {
    birds.push(new Bird());
  }
  brain = new Brain(3);
  reset();

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
        pipes.push(new Pipe(PIPE_GAP + i*PIPE_GAP));
    }
    for(let b of birds) b.init();
    died = false;
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
        if(pipe.x + pipe.w >= 0) pipesNew.push(pipe);
        else addPipe = true;
        if(pipe.x > maxX) maxX = pipe.x;
        /*
        if(!pipe.passed && bird.x > pipe.x + pipe.w) {
            pipe.passed = true;
            earnedPoint = true;
            points++;
        }
        */
    }
    if(addPipe) pipesNew.push(new Pipe(maxX + PIPE_GAP));
    pipes = pipesNew;

    for(let b of birds) b.update(pipes, 1.0/60);

    died = birds.every((b) => b.dead);
    brain.process(this, birds, pipes, earnedPoint);
    earnedPoint = false;

    if(died) reset();
}

function draw() {
  background(0, 170, 255);

  pointDiv.html(points);
  randDiv.html(randthresh);

  birds.forEach((b, i) => {
    if(!b.dead) b.draw();
  });
  for(let pipe of pipes) pipe.draw();

}
