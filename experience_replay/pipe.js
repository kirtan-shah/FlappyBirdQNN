
const GAP = 200;
const WIDTH = 70;

class Pipe {

    constructor(x) {
        this.x = x;
        this.top = random(75, height - 75 - GAP);
        this.bottom = height - GAP - this.top;
        this.w = WIDTH;
        this.passed = false;
    }

    update() {
        this.x -= 6;
    }

    draw() {
        fill(0, 255, 0);
        rect(this.x, 0, this.w, this.top);
        rect(this.x, this.top + GAP, this.w, this.bottom);
    }

    hit(bird) {
        let dx = bird.x - max(this.x, min(bird.x, this.x + this.w));
        let dy1 = bird.y - max(0, min(bird.y, 0 + this.top));
        let dy2 = bird.y - max(this.top + GAP, min(bird.y, height));
        return (dx*dx + dy1*dy1) < (bird.r * bird.r) || (dx*dx + dy2*dy2) < (bird.r * bird.r);
    }

}
