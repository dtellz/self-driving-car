const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 600;


const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
const cars = generateCars(1);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));
        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
} else {
    // hardcoded already trained model
    localStorage.setItem("bestBrain", JSON.stringify({ "levels": [{ "inputs": [0.5296929169701191, 0.1309858239872136, 0, 0, 0], "outputs": [0, 0, 0, 0, 0, 1], "biases": [0.2787949381751573, 0.046424405618833445, 0.49427635746974524, 0.30181652341137877, 0.2422202155217318, -0.13230894226283574], "weights": [[-0.5578074724844011, 0.16731222151011269, 0.24814960939323644, -0.4894511830757161, -0.5486900777107481, 0.4806595109901223], [-0.31725800468459725, -0.6329235040342174, 0.5179940657414572, -0.14344785054033854, 0.09039984579896503, 0.04791823330187188], [0.06969992668262635, 0.48198904967815503, 0.3677217093427667, 0.30910752094720373, -0.4429768023451781, -0.016703823008023658], [-0.6375633219549147, 0.577019906898031, 0.34960838461240107, -0.26936155773810216, 0.2200042314193048, 0.5105822297216777], [-0.5826159167244069, -0.3236942937322723, -0.21102108330036864, 0.35400477589025525, -0.2463249943686493, -0.0773658525539726]] }, { "inputs": [0, 0, 0, 0, 0, 1], "outputs": [1, 0, 0, 0], "biases": [0.12687156879866873, 0.07132551747246255, -0.15557739244447705, 0.5517927816318425], "weights": [[-0.23374887759058133, 0.03192607852858864, 0.13583495744022825, -0.44326751290380756], [0.4034691971869109, 0.3726719862754345, -0.032142317609946985, 0.30749000176115165], [0.05305884067141091, -0.49925576826974866, 0.5803272764457001, 0.2561692600234936], [0.0011115040121121023, -0.3720579661125966, -0.0017043367082830649, 0.17223456742479595], [0.23251824469933657, 0.2573926533670072, -0.19618219753312877, 0.5923397233802682], [0.45149143331613995, 0.013250543612117291, -0.6157878851323353, -0.49426043358141014]] }] }));
    window.location.reload();
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
]

animate();

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discard() {
    localStorage.removeItem("bestBrain")
}

function generateCars(N) {
    const cars = [];

    for (let i = 0; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let j = 0; j < cars.length; j++) {
        cars[j].update(road.borders, traffic);
    }
    // fitness function
    bestCar = cars.find(c => c.y === Math.min(...cars.map(c => c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha = 0.2;
    for (let k = 0; k < cars.length; k++) {
        cars[k].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true)

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;

    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}
