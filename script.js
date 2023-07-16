const canvas = document.querySelector("canvas");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const coordonateX = {val: 30}, coordonateY = {val: canvas.height / 2};
const isHit = {val: false};

class Dinosaur {
    constructor(dinosaurWidth, dinosaurHeight) {
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(dinosaurWidth.val, dinosaurHeight.val, 60, 60);
    }

    jump(currentWidth, currentHeight) {
        ctx.fillStyle = "rgb(135, 206, 235)";
        ctx.fillRect(currentWidth.val, currentHeight.val, 60, 60);
        currentHeight.val = currentHeight.val - 5;
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(currentWidth.val, currentHeight.val, 60, 60);
    }

    fall(currentWidth, currentHeight) {
        ctx.fillStyle = "rgb(135, 206, 235)";
        ctx.fillRect(currentWidth.val, currentHeight.val, 60, 60);
        currentHeight.val = currentHeight.val + 5;
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(currentWidth.val, currentHeight.val, 60, 60);
    } 

    disappear(currentWidth, currentHeight) {
        ctx.fillStyle = "rgb(135, 206, 235)";
        ctx.fillRect(currentWidth.val, currentHeight.val, 60, 60);
    }
}

class Obstacle {
    constructor(currentWidth, currentHeight) {
        ctx.fillStyle = "rgb(1, 50, 32)";
        ctx.fillRect(currentWidth.val, currentHeight.val, 40, 20);
    }

    closeRange(currentWidth, currentHeight, poz) {
        ctx.fillStyle = "rgb(135, 206, 235)";
        ctx.fillRect(currentWidth.val[poz], currentHeight.val, 40, 20);
        currentWidth.val[poz] = currentWidth.val[poz] - 5;
        ctx.fillStyle = "rgb(1, 50, 32)";
        ctx.fillRect(currentWidth.val[poz], currentHeight.val, 40, 20);
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
                if (value.val == 20) {
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
    for (let i = 0; i < 5; ++i) {
        obstacle.closeRange(currentX, currentY, i);
    }
    if (currentX.val[0] >= width / 2 && currentX.val[0] <= width / 2 + 285) {
        isTrue.val = false;
        currentX.val[4] = currentX.val[3];
        currentX.val[3] = currentX.val[2];
        currentX.val[2] = currentX.val[1];
        currentX.val[1] = currentX.val[0];
        currentX.val[0] = width;
    }
    if (((currentX.val[3] >= currentWidth.val && currentX.val[3] <= currentWidth.val + 60) || 
    (currentWidth.val - currentX.val[3] >= 0 && currentWidth.val - currentX.val[3] <= 50))
        && currentY.val == currentHeight.val + 40) {
        clearInterval(comingTheObstacles);
        gameOver(dinosaur, score);
    } else if (currentWidth.val - currentX.val[3] > 40 && isTrue.val == false) {
        isTrue.val = true;
        ++score.val;
    }
}

function startGame() {
    ctx.beginPath();
    ctx.moveTo(0, coordonateY.val + 61);
    ctx.lineTo(width, coordonateY.val + 61);
    ctx.stroke();
    ctx.fillStyle = "rgb(135, 206, 235)";
    ctx.fillRect(0, 0, width, height / 2 + 60);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(0, coordonateY.val + 60, width, (height / 2) + 30);
    sun();
    const dinosaur = new Dinosaur(coordonateX, coordonateY);
    const currentWidth = {val: coordonateX.val}, currentHeight = {val: coordonateY.val};
    const isPressed = {val: false};
    gameController(dinosaur, currentWidth, currentHeight, isPressed);
    const currentX = {val: [width, width, width, width, width]};
    const currentY = {val: (currentHeight.val + 40)};
    const obstacle = new Obstacle(currentX.val[0], currentY);
    const score = {val: 0}, isTrue = {val: false};
    comingTheObstacles = setInterval(function() {
        avoidTheObstacle(dinosaur, obstacle, score, currentWidth, currentHeight, currentX, 
            /*currentX2, currentX3, currentX4, currentX5,*/ currentY, isTrue, comingTheObstacles);
    }, 15); 
}

function refresh() {
    window.location.reload();
}

function gameOver(dinosaur, score) {
    isHit.val = true;
    dinosaur.disappear(coordonateX, coordonateY);
    ctx.fillStyle = "rgb(135, 206, 235)";
    ctx.fillRect(0, 0, width, height / 2 + 60);
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(0, coordonateY.val + 60, width, (height / 2) + 30);
    sun();
    ctx.fillStyle = "black";
    ctx.font = "48px Arial";
    ctx.fillText("Game over!", (width / 2) - 110, (height / 2 - 50));
    ctx.fillText("Your score is " + score.val + "!", (width / 2) - 150, height / 2);
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