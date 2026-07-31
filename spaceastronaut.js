let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Astronaut configuration
let astronautWidth = 88;
let astronautHeight = 94;
let astronautX = 50;
let astronautY = 250 - 94;
let astronautImg;

let astronaut = {
    x : astronautX,
    y : astronautY,
    width : astronautWidth,
    height : astronautHeight
}

// Planet configuration baseline units
let planetArray = [];
let planetX = 700;

let planet1Img;
let planet2Img;
let planet3Img;

// Game Physics and State Tracking
let velocityX = -8; 
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let gameStarted = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    if (board) {
        board.height = boardHeight;
        board.width = boardWidth;
        context = board.getContext("2d"); 
    }

    // Initialize character asset paths with cloud safety fallbacks
    astronautImg = new Image();
    astronautImg.src = "Astronaut Sprite 86x86.png";
    astronautImg.onerror = function() { astronautImg.src = "img/Astronaut Sprite 86x86.png"; };
    astronautImg.onload = function() {
        if (context) context.drawImage(astronautImg, astronaut.x, astronaut.y, astronaut.width, astronaut.height);
    }

    // Initialize planet asset paths with cloud safety fallbacks
    planet1Img = new Image();
    planet1Img.src = "Planet - 1.png";
    planet1Img.onerror = function() { planet1Img.src = "img/Planet - 1.png"; };

    planet2Img = new Image();
    planet2Img.src = "Planet - 2.png";
    planet2Img.onerror = function() { planet2Img.src = "img/Planet - 2.png"; };

    planet3Img = new Image();
    planet3Img.src = "Planet - 3.png";
    planet3Img.onerror = function() { planet3Img.src = "img/Planet - 3.png"; };

    // SAFE UI INTERFACING: Checks if elements exist before executing to prevent crashes
    let startBtn = document.getElementById("start-btn");
    let startMenu = document.getElementById("start-menu");
    let gameContainer = document.getElementById("game-container");

    if (startBtn) {
        startBtn.addEventListener("click", function() {
            if (!gameStarted) {
                if (startMenu) startMenu.style.display = "none";
                if (gameContainer) gameContainer.style.display = "block";
                
                gameStarted = true;
                gameOver = false;
                
                requestAnimationFrame(update);
                setInterval(placePlanet, 1000); 
                document.addEventListener("keydown", moveAstronaut);
            }
        });
    } else {
        // ULTIMATE FALLBACK: If your HTML button ID is named differently, pressing Spacebar will still launch it!
        document.addEventListener("keydown", function(e) {
            if (e.code === "Space" && !gameStarted) {
                if (startMenu) startMenu.style.display = "none";
                if (gameContainer) gameContainer.style.display = "block";
                gameStarted = true;
                gameOver = false;
                requestAnimationFrame(update);
                setInterval(placePlanet, 1000); 
                document.addEventListener("keydown", moveAstronaut);
            }
        });
    }
}

function update() {
    requestAnimationFrame(update);
    if (gameOver || !context) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Gravity calculation tracking mechanics
    velocityY += gravity;
    astronaut.y = Math.min(astronaut.y + velocityY, astronautY); 
    context.drawImage(astronautImg, astronaut.x, astronaut.y, astronaut.width, astronaut.height);

    // Process and render obstacle array vectors
    for (let i = 0; i < planetArray.length; i++) {
        let planet = planetArray[i];
        planet.x += velocityX;
        context.drawImage(planet.img, planet.x, planet.y, planet.width, planet.height);

        if (detectCollision(astronaut, planet)) {
            gameOver = true;
            let gameOverImg = new Image();
            gameOverImg.src = "-Pngtree-game over screen sign with_5995257.png";
            gameOverImg.onerror = function() { gameOverImg.src = "img/-Pngtree-game over screen sign with_5995257.png"; };
            gameOverImg.onload = function() {
                context.drawImage(gameOverImg, boardWidth/2 - 150, boardHeight/2 - 50, 300, 100);
            }
        }
    }

    // Render operational score interface layout metrics
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 20, 35);
    
    // WIN STATE CONDITION: Triggers custom canvas shield display at 1750 points
    if (score >= 1750) {
        gameOver = true;
        context.fillStyle = "rgba(18, 14, 46, 0.85)";
        context.fillRect(0, 0, board.width, board.height);
        context.fillStyle = "#ffd700";
        context.font = "bold 32px 'Courier New'";
        context.textAlign = "center";
        context.fillText("VICTORY! YOU SURVIVED!", board.width / 2, board.height / 2);
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
        y : null,
        width : null,
        height : null
    }

    let placePlanetChance = Math.random(); 

    // GEOMETRIC PROPORTIONS ACCURACY: Locks perfect width-height scaling ratios
    if (placePlanetChance > .90) { 
        planet.img = planet3Img;
        planet.width = 90;
        planet.height = 90;
        planet.y = boardHeight - 90; // Sets floor boundaries perfectly so bottom doesn't cut off
        planetArray.push(planet);
    }
    else if (placePlanetChance > .70) { 
        planet.img = planet2Img;
        planet.width = 65;
        planet.height = 65;
        planet.y = boardHeight - 65; // Sets floor boundaries perfectly so bottom doesn't cut off
        planetArray.push(planet);
    }
    else if (placePlanetChance > .50) { 
        planet.img = planet1Img;
        planet.width = 34;
        planet.height = 34;
        planet.y = boardHeight - 34; // Sets floor boundaries perfectly so bottom doesn't cut off
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

// Interactive Reset Trigger Hook Elements
let resetBtn = document.getElementById('restart-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', function() {
        gameOver = false;
        score = 0;
        astronaut.y = boardHeight - astronautHeight;
        velocityY = 0;
        planetArray = [];
    });
}