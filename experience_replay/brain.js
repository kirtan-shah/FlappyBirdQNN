
const gamma = .9;
const randdecay = .9999;
let randthresh = .1;

const PIPE_GAP = 1000.0;

class Brain {

    constructor(num_inputs) {
        this.num_inputs = num_inputs;
        this.nn = tf.sequential();
        //kernelRegularizer: tf.regularizers.l2(1e-2), biasRegularizer: tf.regularizers.l2(1e-2)
        this.nn.add(tf.layers.dense({ units: 10, inputShape: [num_inputs], activation: 'relu' })); //hidden layer with size 10
        this.nn.add(tf.layers.dense({ units: 2, activation: 'linear' }));  //q value, linear
        this.nn.compile({optimizer: 'adam', lr: .01,  loss: 'meanSquaredError'});
    }

    predict(inputs) {
        const X = tf.tensor2d([inputs], [1, this.num_inputs]);
        const y = this.nn.predict(X);
        const out = y.dataSync();
        return out;
    }

    randomAction() {
        let randAction = Math.random() < randthresh;
        let actionJump = randAction ? (Math.random() < .5) : (Q_jump > Q_stay);
        return actionJump;
    }

    process(app, b, game) {

      let inputsM = []; //states
      let qs = []; //original q values
      let actions = []; //actions
      let outputsM = []; //states'
      let liveBirds = [];
      for(let bird of game.birds) {
        if(bird.dead) continue;
        liveBirds.push(bird);

        let inputs = game.getState(bird);
        inputsM.push(inputs);
        let Q = this.predict(inputs);
        qs.push(Q);
        let Q_jump = Q[0];
        let Q_stay = Q[1];
        //let R = .1;
        //if(bird.justDead) R = -10;

        //console.log(Q_jump.toFixed(2), Q_stay.toFixed(2));

        let jump = randomAction();
        actions.push(jump ? 1 : 0);
        let X;
        let y;
        if(jump) {
            bird.jump();
            //outputsM.push([R + gamma * Q_jump, Q_stay]);
        }
        else {
            //X = tf.tensor2d([inputs], [1, this.num_inputs]); //tf.tensor2d([inputs.concat([0, 1])], [1, 7]);
            //outputsM.push([Q_jump, R + gamma * Q_stay]);
        }
      }

      //do actions, get reward
      let R_vals = game.update(actions);
      for(let i = 0; i < actions.length; i++) {
        let Q_prime = this.predict(game.getState(liveBirds[i]));
        let actual = R_vals[i] + gamma * Math.max(Q_prime[0], Q_prime[1]);
        //console.log(actual, R_vals[i], Q_prime);
        let data = actions[i] == 0 ? [qs[i][0], actual] : [actual, qs[i][1]];
        outputsM.push(data);
      }
      //console.log(inputsM);

      let X = tf.tensor2d(inputsM, [inputsM.length, this.num_inputs]);
      let y = tf.tensor2d(outputsM, [outputsM.length, 2]);
      this.nn.fit(X, y).then(() => { app.shouldUpdate = true; });

      randthresh *= randdecay;

      let inputs = game.getState(b);
      let Q = this.predict(inputs);
      if(Q[0] > Q[1]) b.jump();

      game.allDead = game.allDead && b.dead;


    }


    // actual= R + γ max A` Q(S`, A`)



}
