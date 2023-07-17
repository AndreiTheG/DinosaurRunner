const canvas = document.querySelector("canvas");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const coordonateX = {val: 30}, coordonateY = {val: canvas.height / 2};
const isHit = {val: false};
const dinosaurSize = {val: 60};
const obstacleWidth = {val: 40}, obstacleHeight = {val: 20};
const firstMessageWidth = {val: (width / 2) - 110}, firstMessageHeight = {val: (height / 2) - 50};
const secMessageWidth = {val : (width / 2) - 150};
const arraySize = {val: 4};
const nrIterations = {val: 20};
const groundHeight = {val: coordonateY.val + 60};
const maxCoordXPos = {val: width / 2 + 285};

class Dinosaur {
    constructor(dinosaurWidth, dinosaurHeight) {
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(dinosaurWidth.val, dinosaurHeight.val, dinosaurSize.val, dinosaurSize.val);
    }

    jump(currentWidth, currentHeight) {
        ctx.fillStyle = "rgb(135, 206, 235)";
        ctx.fillRect(currentWidth.val, currentHeight.val, dinosaurSize.val, dinosaurSize.val);
        currentHeight.val = currentHeight.val - 5;
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(currentWidth.val, currentHeight.val, dinosaurSize.val, dinosaurSize.val);
    }

    fall(currentWidth, currentHeight) {
        ctx.fillStyle = "rgb(135, 206, 235)";
        ctx.fillRect(currentWidth.val, currentHeight.val, dinosaurSize.val, dinosaurSize.val);
        currentHeight.val = currentHeight.val + 5;
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(currentWidth.val, currentHeight.val, dinosaurSize.val, dinosaurSize.val);
    } 

    disappear(currentWidth, currentHeight) {
        ctx.fillStyle = "rgb(135, 206, 235)";
        ctx.fillRect(currentWidth.val, currentHeight.val, dinosaurSize.val, dinosaurSize.val);
    }
}

class Obstacle {
    constructor(currentWidth, currentHeight) {
        ctx.fillStyle = "rgb(1, 50, 32)";
        ctx.fillRect(currentWidth.val, currentHeight.val, obstacleWidth.val, obstacleHeight.val);
    }

    closeRange(currentWidth, currentHeight, poz) {
        ctx.fillStyle = "rgb(135, 206, 235)";
        ctx.fillRect(currentWidth.val[poz], currentHeight.val, obstacleWidth.val, obstacleHeight.val);
        currentWidth.val[poz] = currentWidth.val[poz] - 5;
        ctx.fillStyle = "rgb(1, 50, 32)";
        ctx.fillRect(currentWidth.val[poz], currentHeight.val, obstacleWidth.val, obstacleHeight.val);
    }
}

function gameController(dinosaur, currentWidth, currentHeight, isPressed) {
    const pressed = {val: false};
    window.addEventListener("keydown", (event) => {
        if (event.key == " " && pressed.val == false && isHit.val == false) {
            pressed.val = true; 
            isPressed.val = true;
            const value = {val: 0};
            timeout = setInterval(function() {
                dinosaur.jump(currentWidth, currentHeight);
                ++value.val;
                val = value.val;
                if (value.val == nrIterations.val) {
                    value.val = 0;
                    timeout2 = setInterval(function() {
                        ++value.val;
                        dinosaur.fall(currentWidth, currentHeight);
                        if (value.val == 20) {
                            pressed.val = false;
                            clearInterval(timeout2);
                        }
                    }, 20);
                    clearInterval(timeout);
                }
            }, 20);
        } 
    }); 
}

function sun() {
    ctx.beginPath();
    ctx.arc(850, 80, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.strokeStyle = "rgb(255, 255, 0)";
    ctx.fill();
    ctx.stroke();   
}

function avoidTheObstacle(dinosaur, obstacle, score, currentWidth, currentHeight, currentX, currentY, isTrue, comingTheObstacles) {
    for (let i = 0; i <= arraySize.val; ++i) {
        obstacle.closeRange(currentX, currentY, i);
    }
    if (currentX.val[0] >= width / 2 && currentX.val[0] <= maxCoordXPos.val) {
        isTrue.val = false;
        for (let i = arraySize.val; i > 0; --i) {
            currentX.val[i] = currentX.val[i - 1];
        }
        currentX.val[0] = width;
    }
    if (((currentX.val[arraySize.val - 1] >= currentWidth.val && currentX.val[arraySize.val - 1] <= currentWidth.val + dinosaurSize.val) || 
    (currentWidth.val - currentX.val[arraySize.val - 1] >= 0 && currentWidth.val - currentX.val[arraySize.val - 1] <= obstacleWidth.val + 10))
        && currentY.val == currentHeight.val + dinosaurSize.val - obstacleHeight.val) {
        clearInterval(comingTheObstacles);
        gameOver(dinosaur, score);
    } else if (currentWidth.val - currentX.val[arraySize.val - 1] > obstacleWidth.val && isTrue.val == false) {
        isTrue.val = true;
        ++score.val;
    }
}

function startGame() {
    ctx.beginPath();
    ctx.moveTo(0, coordonateY.val + dinosaurSize.val + 1);
    ctx.lineTo(width, coordonateY.val + dinosaurSize.val + 1);
    ctx.stroke();
    ctx.fillStyle = "rgb(135, 206, 235)";
    ctx.fillRect(0, 0, width, height / 2 + dinosaurSize.val);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(0, groundHeight.val, width, height / 2);
    sun();
    const dinosaur = new Dinosaur(coordonateX, coordonateY);
    const currentWidth = {val: coordonateX.val}, currentHeight = {val: coordonateY.val};
    const isPressed = {val: false};
    gameController(dinosaur, currentWidth, currentHeight, isPressed);
    const currentX = {val: [width, width, width, width, width]};
    const currentY = {val: (currentHeight.val + dinosaurSize.val - obstacleHeight.val)};
    const obstacle = new Obstacle(currentX.val[0], currentY);
    const score = {val: 0}, isTrue = {val: false};
    comingTheObstacles = setInterval(function() {
        avoidTheObstacle(dinosaur, obstacle, score, currentWidth, currentHeight, currentX, currentY, isTrue, comingTheObstacles);
    }, 15); 
}

function refresh() {
    window.location.reload();
}

function gameOver(dinosaur, score) {
    isHit.val = true;
    dinosaur.disappear(coordonateX, coordonateY);
    ctx.fillStyle = "rgb(135, 206, 235)";
    ctx.fillRect(0, 0, width, height / 2 + dinosaurSize.val);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(0, groundHeight.val, width, height / 2);
    sun();
    ctx.fillStyle = "black";
    ctx.font = "48px Arial";
    ctx.fillText("Game over!", firstMessageWidth.val, firstMessageHeight.val);
    ctx.fillText("Your score is " + score.val + "!", secMessageWidth.val, height / 2);
    let container = document.createElement('div');
    container.className = "text-center"
    let button = document.createElement('button');
    button.className = "btn btn-danger";
    button.innerHTML = "Replay";
    button.addEventListener('click', () => {
        refresh()
    });
    container.appendChild(button);
    document.body.appendChild(container);
}

startGame();