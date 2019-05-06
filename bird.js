
const SIZE = 30;

class Bird {

    constructor() {
        this.init();
    }

    init() {
        this.r = SIZE/2;
        this.x = 100;
        this.y = random(200, height - 200);
        this.velocity = 0;
        this.dead = false;
    }

    getClosestPipe(pipes) {
      let p = pipes[0];
      let minX = pipes[0].x;
      for(let pipe of pipes) {
          if(pipe.x > this.x && pipe.x < minX) {
              minX = pipe.x;
              p = pipe;
          }
      }
      return p;
    }

    jump() {
        this.velocity = -400;
    }

    update(pipes, deltat) {
        this.y += this.velocity*deltat;
        this.velocity += 1000*deltat;

        let collide = false;
        for(let pipe of pipes) {
          if(pipe.hit(this)) {
            collide = true;
            break;
          }
        }
        this.justDead = false;
        let dead = this.dead || collide || this.y + this.r > height || this.y - this.r < 0;
        if(!this.dead && dead) this.justDead = true;
        this.dead = dead;
    }

    draw(blue) {
        if(blue) fill(255, 0, 0);
        else fill(100, 120);
        ellipse(this.x, this.y, SIZE, SIZE);
    }
}
