class NeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
    }
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);

    }

    static #randomize(level) {
        for (let i; i < level.inputs.length; i++) {
            for (let j; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let k; k < level.biases.length; k++) {
            level.biases[k] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let j = 0; j < level.outputs.length; j++) {
            let sum = 0;
            for (let k = 0; k < level.inputs.length; k++) {
                sum += level.inputs[k] * level.weights[k][j];
            }

            if (sum > level.biases[j]) {
                level.outputs[j] = 1;
            } else {
                level.outputs[j] = 0;
            }
        }
        return level.outputs;
    }

}