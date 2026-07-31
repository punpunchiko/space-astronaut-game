let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

let astronautWidth = 88;
let astronautHeight = 94;
let astronautX = 50;
let astronautY = boardHeight - astronautHeight;
let astronautImg;

let astronaut = {
    x : astronautX,
    y : astronautY,
    width : astronautWidth,
    height : astronautHeight
}

let planetArray = [];

let planet1Width = 70;
let planet2Width = 70;
let planet3Width = 70;

let planetHeight = 70;
let planetX = 700;
let planetY = boardHeight - planetHeight;

let planet1Img;
let planet2Img;
let planet3Img;

let velocityX = -8; 
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let gameStarted = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 

   // Load initial astronaut character graphic asset
    astronautImg = new Image();
    // FIXED PATH: Removed folder directory prefix!
    astronautImg.src = "Astronaut Sprite 86x86.png"; 
    astronautImg.onload = function() {
        context.drawImage(astronautImg, astronaut.x, astronaut.y, astronaut.width, astronaut.height);
    }

    // Initialize planet obstacle images
    // FIXED PATHS: Removed folder directory prefixes!
    planet1Img = new Image();
    planet1Img.src = "Planet - 1.png";

    planet2Img = new Image();
    planet2Img.src = "Planet - 2.png";

    planet3Img = new Image();
    planet3Img.src = "Planet - 3.png";

    startBtn.addEventListener("click", function() {
        if (!gameStarted) {
            startMenu.style.display = "none";      
            gameContainer.style.display = "block";  
            
            gameStarted = true;
            gameOver = false;
            
            requestAnimationFrame(update);
            setInterval(placePlanet, 1000); 
            document.addEventListener("keydown", moveAstronaut);
        }
    });
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    astronaut.y = Math.min(astronaut.y + velocityY, astronautY); 
    context.drawImage(astronautImg, astronaut.x, astronaut.y, astronaut.width, astronaut.height);

    for (let i = 0; i < planetArray.length; i++) {
        let planet = planetArray[i];
        planet.x += velocityX;
        context.drawImage(planet.img, planet.x, planet.y, planet.width, planet.height);

        if (detectCollision(astronaut, planet)) {
            gameOver = true;
            let gameOverImg = new Image();
            gameOverImg.src = "./img/-Pngtree-game over screen sign with_5995257.png";
            gameOverImg.onload = function() {
                context.drawImage(gameOverImg, boardWidth/2 - 150, boardHeight/2 - 50, 300, 100);
            }
        }
    }

    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 20, 23);
    
    if (score >= 1750) {
        gameOver = true;
        context.fillStyle = "rgba(18, 14, 46, 0.9)";
        context.fillRect(0, 0, board.width, board.height);
        context.fillStyle = "#ffd700";
        context.font = "bold 32px 'Courier New'";
        context.textAlign = "center";
        context.fillText("HAZAH! VICTORY AT LAST!", board.width / 2, board.height / 2);
        return;
    }
}

function moveAstronaut(e) {
    if (gameOver) {
        return;
    }
    if ((e.code == "Space" || e.code == "ArrowUp") && astronaut.y == astronautY) {
        velocityY = -10; 
    }
}

function placePlanet() {
    if (gameOver) {
        return;
    }

    let planet = {
        img : null,
        x : planetX,
        y : planetY,
        width : null,
        height : planetHeight
    }

    let placePlanetChance = Math.random(); 

    if (placePlanetChance > .90) { 
        planet.img = planet3Img;
        planet.width = planet3Width;
        planetArray.push(planet);
    }
    else if (placePlanetChance > .70) { 
        planet.img = planet2Img;
        planet.width = planet2Width;
        planetArray.push(planet);
    }
    else if (placePlanetChance > .50) { 
        planet.img = planet1Img;
        planet.width = planet1Width;
        planetArray.push(planet);
    }

    if (planetArray.length > 5) {
        planetArray.shift(); 
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && 
           a.x + a.width > b.x && 
           a.y < b.y + b.height && 
           a.y + a.height > b.y; 
}

document.getElementById('restart-btn').addEventListener('click', function() {
    gameOver = false;
    score = 0;
    astronaut.y = boardHeight - astronautHeight;
    velocityY = 0;
    planetArray = [];
});