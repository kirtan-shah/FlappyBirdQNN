
let game;
let brain;
const batch_size = 64;

let points = 0;
let earnedPoint = false;

let pointsDiv, randDiv;


function setup() {
  createCanvas(1200, 675);
  tf.setBackend('cpu');

  game = new Game();

  brain = new Brain(3);
  reset();

  pointDiv = createDiv('');
  randDiv = createDiv('');

  frameRate(60);
}

function reset() {
    game.reset();
}

function keyPressed() {
    if(key == ' ') bird.jump();
}

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function episode() {
    let experiences = [];
    let s = game.getState();
    let steps = 0;
    while(steps < 60*10 && !game.bird.dead) {
        let a = game.randomAction();
        let r = game.update(a);
        let sp = s.getState();
        experiences.push([s, a, r, sp]);
        s = sp;
        steps++;
        let mb = getRandom(experiences, Math.min(experiences.length, batch_size));
        let states = new Array(mb.length);
        let actions = new Array(mb.length);
        mb.forEach((val, index) => {
            states[index] = val[0];
        });

        Get random minibatch of exp tuples from M
         Set Q_target = reward(s,a) +  γmaxQ(s')
         Update w =  α(Q_target - Q_value) *  ∇w Q_value
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
