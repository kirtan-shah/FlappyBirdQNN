
class Game {

  constructor() {
    this.allDead = false;
    this.birds = [];
    this.pipes = [];
    this.numbirds = 10;
    this.reset();
  }

  reset() {
    this.pipes = [];
    this.birds = [];
    for(let i = 0; i < this.numbirds; i++) {
      this.birds.push(new Bird());
    }
    for(let i = 0; i < 5; i++) {
        this.pipes.push(new Pipe(PIPE_GAP + i*PIPE_GAP));
    }
    for(let b of this.birds) b.init();
  }

  getState(bird) {
    let p = bird.getClosestPipe(this.pipes);
    let state = [ ((p.top + GAP) - bird.y) / height, (p.x - bird.x) / PIPE_GAP, (bird.velocity) / 400];
    return state;
  }

  update(actions) {
    let pipesNew = [];
    let addPipe = false;
    let maxX = 0;
    for(let pipe of this.pipes) {
        pipe.update();
        if(pipe.x + pipe.w >= 0) pipesNew.push(pipe);
        else addPipe = true;
        if(pipe.x > maxX) maxX = pipe.x;
    }
    if(addPipe) pipesNew.push(new Pipe(maxX + PIPE_GAP));
    this.pipes = pipesNew;

    for(let b of this.birds) b.update(this.pipes, 1.0/60);

    this.allDead = this.birds.every((b) => b.dead);

    let R_vals = [];
    for(let b of this.birds) {
      if(!b.dead) {
        R_vals.push(.1);
      }
      else if(b.justDead) {
        R_vals.push(-10);
      }
    }
    return R_vals;

  }

  draw() {
    background(0, 170, 255);
    this.birds.forEach((b, i) => {
      if(!b.dead) b.draw(false);
    });
    for(let pipe of this.pipes) pipe.draw();
  }


}
