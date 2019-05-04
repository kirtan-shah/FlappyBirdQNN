
const gamma = .9;
const randdecay = .9999;
let randthresh = 1;

class Brain {

    constructor(num_inputs) {
        this.num_inputs = num_inputs;
        this.nn = tf.sequential();
        this.nn.add(tf.layers.dense({ units: 16, inputShape: [num_inputs], activation: 'elu', kernelRegularizer: tf.regularizers.l2(1e-2), biasRegularizer: tf.regularizers.l2(1e-2) })); //hidden layer with size 10
        this.nn.add(tf.layers.dense({ units: 4, inputShape: [num_inputs], activation: 'elu', kernelRegularizer: tf.regularizers.l2(1e-2) }));
        this.nn.add(tf.layers.dense({ units: 2, activation: 'linear', kernelRegularizer: tf.regularizers.l2(1e-4) }));  //q value, linear
        this.nn.compile({optimizer: 'sgd', lr: .01,  loss: 'meanSquaredError'});
    }

    predict(inputs) {
        const X = tf.tensor2d([inputs], [1, this.num_inputs]);
        const y = this.nn.predict(X);
        const out = y.dataSync();
        return out;
    }

    process(app, bird, pipes, earnedPoint, died, died2, train) {
        let p = pipes[0];
        let minX = pipes[0].x;
        for(let pipe of pipes) {
            if(pipe.x > bird.x && pipe.x < minX) {
                minX = pipe.x;
                p = pipe;
            }
        }
        //inputs - top pos, bottom pos, closest pipe dist, bird height, bird velocity
        let inputs = [ (bird.y - p.top) / height , (bird.y - (p.top + GAP)) / height, (p.x - bird.x) / width, bird.y / height, (bird.velocity + 400) / 400];
        let Q = this.predict(inputs);
        let Q_jump = Q[0];//this.predict(inputs.concat([1, 0]));
        let Q_stay = Q[1];//this.predict(inputs.concat([0, 1]));
        let R = 0.001;
        if(earnedPoint) R = 2;
        if(died) R = -10;
        if(died2) R = -30;

        //console.log(Math.round(Q_jump*10000)/10000, Math.round(Q_stay*10000)/10000, R + gamma*Math.max(Q_jump, Q_stay));
        //console.log(R, Q_jump - Q_stay);
        let randAction = Math.random() < (randthresh *= randdecay);
        let actionJump = randAction ? (Math.random() < .001) : (Q_jump > Q_stay);
        let X;
        let y;
        if(actionJump) {
            bird.jump();
            X = tf.tensor2d([inputs], [1, 5]);//tf.tensor2d([inputs.concat([1, 0])], [1, 7]);
            let actual = R + gamma * Q_jump;
            y = tf.tensor2d([[actual, Q_stay]], [1, 2]);
        }
        else {
            X = X = tf.tensor2d([inputs], [1, 5]); //tf.tensor2d([inputs.concat([0, 1])], [1, 7]);
            let actual = R + gamma * Q_stay;
            y = tf.tensor2d([[Q_jump, actual]], [1, 2]);
        }
        if(q1) {
            q1.style('color', 'black');
            q2.style('color', 'black');
            if(Q_jump > Q_stay) q1.style('color', 'green');
            else q2.style('color', 'green');
            q1.html(Math.round(Q_jump*10000)/10000 + " " + (R + gamma * Q_jump));
            q2.html(Math.round(Q_stay*10000)/10000 + " " + (R + gamma * Q_stay));
        }
        if(train) this.nn.fit(X, y).then(() => { app.shouldUpdate = true; });
        else app.shouldUpdate = true;


    }

    // actual= R + γ max A` Q(S`, A`)



}
