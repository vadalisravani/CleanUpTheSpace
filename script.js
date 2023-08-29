const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let profit = 0;
let spaceshipX = canvas.width/2;
const spaceshipSpeed = 15; 
const debrisList = [];
const gameInterval = 1000 / 60; 

class Debris {
    constructor(x, y, width, height, isUseful) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isUseful = isUseful;
    }
}

const spaceshipImg = new Image();
spaceshipImg.src = "spaceship.png";
const nutsImg = new Image();
nutsImg.src = "bolt.png";
const meteorImg = new Image();
meteorImg.src = "meteor.png";

function drawSpaceship() {
    ctx.drawImage(spaceshipImg, spaceshipX - 30, canvas.height - 60, 60, 45);
}

function drawDebris(debris) {
    const debrisImage = debris.isUseful ? nutsImg : meteorImg;
    const debrisSize = debris.isUseful ? 30 : 50; 
    ctx.drawImage(debrisImage, debris.x, debris.y, debrisSize, debrisSize);
}
const backgroundImage = new Image();
backgroundImage.src = "background1.gif";

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawSpaceship();
    
    for (let i = 0; i < debrisList.length; i++) {
        drawDebris(debrisList[i]);
        debrisList[i].y += 2; 
        
        if (
            spaceshipX >= debrisList[i].x && spaceshipX <= debrisList[i].x + debrisList[i].width &&
            canvas.height - 60 <= debrisList[i].y + debrisList[i].height
        ) {
            if (debrisList[i].isUseful) {
                profit += 10;
                document.getElementById("profit").textContent = profit;
            } else {
                endGame("Oh no! You hit harmful debris.");
            }
            debrisList.splice(i, 1);
            i--;
        }
        
        if (debrisList[i] && debrisList[i].y > canvas.height) {
            debrisList.splice(i, 1);
            i--;
        }
    }
    
    requestAnimationFrame(updateCanvas);
}

//updateCanvas();

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && spaceshipX > 0) {
        spaceshipX -= spaceshipSpeed;
    }
    if (event.key === "ArrowRight" && spaceshipX < canvas.width) {
        spaceshipX += spaceshipSpeed;
    }
});

const upgradeButton = document.getElementById("upgradeButton");
const profitSpan = document.getElementById("profit");

upgradeButton.addEventListener("click", function () {
    if (profit >= 20) {
        profit -= 20;
        document.getElementById("profit").textContent = profit;
        spaceshipSpeed += 1;
    }
});

setInterval(function () {
    const x = Math.random() * (canvas.width - 40);
    const isUseful = Math.random() < 0.7; 
    debrisList.push(new Debris(x, 0, 40, 40, isUseful));
}, 2000);

function endGame() {
    localStorage.setItem("finalScore", profit);
    window.location.href = "score.html";
}


const startButton = document.getElementById("startButton");
let gameStarted = false; 

// Function to start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        updateCanvas();
        backgroundMusic.play();
        context.resume().then(() => {
            console.log('Playback resumed successfully');
        });
        updateCanvas();
    }
}

startButton.addEventListener("click", startGame);



upgradeButton.style.display = "none";

// Full-screen button
const fullScreenButton = document.createElement("button");
fullScreenButton.innerText = "Go Full Screen";
fullScreenButton.id = "fullScreenButton"; 
fullScreenButton.classList.add("full-screen-button"); 
document.body.appendChild(fullScreenButton);

fullScreenButton.addEventListener("click", () => {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) { // For Firefox
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) { // For Chrome, Safari, and Opera
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { // For IE/Edge
        canvas.msRequestFullscreen();
    }
});

const backgroundMusic = document.getElementById("backgroundMusic");
const collisionSound = document.getElementById("collisionSound");
const muteButton = document.getElementById("muteButton");
const volumeSlider = document.getElementById("volumeSlider");

backgroundMusic.volume = volumeSlider.value;
backgroundMusic.play();

function toggleMute() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        muteButton.textContent = "Mute";
    } else {
        backgroundMusic.pause();
        muteButton.textContent = "Unmute";
    }
}

muteButton.addEventListener("click", toggleMute);

volumeSlider.addEventListener("input", function () {
    backgroundMusic.volume = volumeSlider.value;
});


