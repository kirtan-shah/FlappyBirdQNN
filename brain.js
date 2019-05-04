
const gamma = .9;
const randdecay = .9999;
let randthresh = 1;

const PIPE_GAP = 250.0;

class Brain {

    constructor(num_inputs) {
        this.num_inputs = num_inputs;
        this.nn = tf.sequential();
        this.nn.add(tf.layers.dense({ units: 16, inputShape: [num_inputs], activation: 'elu', kernelRegularizer: tf.regularizers.l2(1e-2), biasRegularizer: tf.regularizers.l2(1e-2) })); //hidden layer with size 10
        this.nn.add(tf.layers.dense({ units: 2, activation: 'linear', kernelRegularizer: tf.regularizers.l2(1e-2), biasRegularizer: tf.regularizers.l2(1e-2) }));  //q value, linear
        this.nn.compile({optimizer: 'sgd', lr: .01,  loss: 'meanSquaredError'});
    }

    predict(inputs) {
        const X = tf.tensor2d([inputs], [1, this.num_inputs]);
        const y = this.nn.predict(X);
        const out = y.dataSync();
        return out;
    }

    process(app, birds, pipes, earnedPoint) {

      let inputsM = [];
      let outputsM = [];
      for(let bird of birds) {
        if(bird.dead && !bird.justDead) continue;
        let p = bird.getClosestPipe(pipes);

        //inputs - top pos, bottom pos, closest pipe dist, bird height, bird velocity
        let inputs = [ ((p.top + GAP) - bird.y) / height, (p.x - bird.x) / PIPE_GAP, (bird.velocity) / 400];
        inputsM.push(inputs);
        let Q = this.predict(inputs);
        let Q_jump = Q[0];
        let Q_stay = Q[1];
        let R = .01;
        //if(earnedPoint) R = 2;
        if(bird.justDead) R = -10;

        //console.log(Math.round(Q_jump*10000)/10000, Math.round(Q_stay*10000)/10000, R + gamma*Math.max(Q_jump, Q_stay));
        //console.log(R, Q_jump - Q_stay);
        let randAction = Math.random() < (randthresh);
        let actionJump = randAction ? (Math.random() < .001) : (Q_jump > Q_stay);
        let X;
        let y;
        if(actionJump) {
            bird.jump();
            //X = tf.tensor2d([inputs], [1, this.num_inputs]);//tf.tensor2d([inputs.concat([1, 0])], [1, 7]);
            //let actual = R + gamma * Q_jump;
            //y = tf.tensor2d([[actual, Q_stay]], [1, 2]);
            outputsM.push([R + gamma * Q_jump, Q_stay]);
        }
        else {
            //X = tf.tensor2d([inputs], [1, this.num_inputs]); //tf.tensor2d([inputs.concat([0, 1])], [1, 7]);
            outputsM.push([Q_jump, R + gamma * Q_stay]);
        }
      }
      let X = tf.tensor2d(inputsM, [inputsM.length, this.num_inputs]);
      let y = tf.tensor2d(outputsM, [outputsM.length, 2]);
      this.nn.fit(X, y).then(() => { app.shouldUpdate = true; });
        /*
        if(q1) {
            q1.style('color', 'black');
            q2.style('color', 'black');
            if(Q_jump > Q_stay) q1.style('color', 'green');
            else q2.style('color', 'green');
            q1.html(Math.round(Q_jump*10000)/10000 + " " + (R + gamma * Q_jump));
            q2.html(Math.round(Q_stay*10000)/10000 + " " + (R + gamma * Q_stay));
        }*/
        //this.nn.fit(X, y).then(() => { app.shouldUpdate = true; });
        //else app.shouldUpdate = true;
        randthresh *= randdecay;

    }

    // actual= R + γ max A` Q(S`, A`)



}
