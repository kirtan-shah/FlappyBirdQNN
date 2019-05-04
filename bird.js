
const SIZE = 30;

class Bird {

    constructor() {
        this.init();
    }

    init() {
        this.r = SIZE/2
        this.x = 100;
        this.y = random(this.r, height - this.r);
        this.velocity = 0;
    }

    jump() {
        this.velocity = -400;
    }

    update(deltat) {
        this.y += this.velocity*deltat;
        this.velocity += 1000*deltat;
    }

    draw() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, SIZE, SIZE);
    }
}
