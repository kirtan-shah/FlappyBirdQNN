
class Game {

  constructor() {
    this.reset();
  }

  reset() {
    this.pipes = [];
    for(let i = 0; i < 5; i++) {
        this.pipes.push(new Pipe(PIPE_GAP + i*PIPE_GAP));
    }
    this.bird = new Bird();
  }

  getState() {
    let p = this.bird.getClosestPipe(this.pipes);
    let state = [ ((p.top + GAP) - this.bird.y) / height, (p.x - this.bird.x) / PIPE_GAP, (this.bird.velocity) / 400];
    return state;
  }

  update(action) {
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

    if(action == 1) this.bird.jump();
    this.bird.update(this.pipes, 1.0/60);

    if(b.justDead) return -11;
    return .26;
  }

  draw() {
    background(0, 170, 255);
    this.bird.draw(true);
    for(let pipe of this.pipes) pipe.draw();
  }


}
