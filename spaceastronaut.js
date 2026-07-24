
//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//astronaut
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

//planet
let planetArray = []

let planet1Width= 34;
let planet2Width = 69;
let planet3Width = 102;

let planetHeight = 70;
let planetX = 700;
let planetY = boardHeight - planetHeight

let planet1Img;
let planet2Img;
let planet3Img;

//physics
let velocityX = -8; //planet moving left speed
let velocityY = 0; 
let gravity = .4;

let gameOver = false;
let score = 0;
window.onload = function() {
    board = document.getElementById("board")
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw intial astronaut
   // context.fillStyle="green";
    // context.fillRect(astronaut.x, astronaut.y, astronaut.width, astronaut.height);

    astronautImg = new Image ()
    astronautImg.src = "./img/Astronaut Sprite 86x86.png";
    astronautImg.onload = function() {
        context.drawImage(astronautImg, astronaut.x, astronaut.y, astronaut.width, astronaut.height);
    }

        
    planet1Img = new Image ();
    planet1Img.src = "./img/Planet - 1.png"
    
    planet2Img = new Image ();
    planet2Img.src = "./img/Planet - 2.png"

    planet3Img = new Image ();
    planet3Img.src = "./img/Planet - 3.png"
   
    requestAnimationFrame(update);
    setInterval(placePlanet, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveAstronaut);
}

function update () {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
   
   
    //astronaut animation and gravity physics
    velocityY += gravity;
    astronaut.y = Math.min(astronaut.y + velocityY, astronautY); //apply gravity to current astronaut.y, making sure it doesn't exceed the ground
    context.drawImage(astronautImg, astronaut.x, astronaut.y, astronaut.width, astronaut.height);

    //planet
    for (let i = 0; i < planetArray.length; i++) {
        let planet = planetArray[i];
        context.drawImage(planet.img, planet.x, planet.y, planet.width, planet.height);
        planet.x += velocityX;
        context.drawImage(planet.img, planet.x, planet.y, planet.width, planet.height);

        if (detectCollision(astronaut, planet))
            gameOver = true;
            let gameOverImg = new Image();
            gameOverImg.src = "./img/-Pngtree-game over screen sign with_5995257.png"
            gameOverImg.onload = function() {
                context.drawImage(gameOverImg, boardWidth/2 - 150, boardHeight/2 - 50, 300, 100);
            }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}
    function moveAstronaut(e){
        if (gameOver) {
            return;
        }
        
        if((e.code == "Space" || e.code == "ArrowUp") && astronaut.y == astronautY) {
            //jump
            velocityY = -10;

        }
    }

function placePlanet() {
 if (gameOver) {
        return;
        }
    //place planet
    let planet = {
        img : null,
        x : planetX,
        y : planetY,
        width : null,
        height: planetHeight
    }

    let placePlanetChance = Math.random(); //0 - 0.9999...

    if (placePlanetChance > .90) { //10% you get planet3
        planet.img = planet3Img;
        planet.width = planet3Width;
        planetArray.push(planet);
    }
    else if (placePlanetChance > .70) { //30% you get planet2 
        planet.img = planet2Img;
        planet.width = planet2Width;
        planetArray.push(planet);
    }
    else if (placePlanetChance > .50) { //50% you get planet1
        planet.img = planet1Img;
        planet.width = planet1Width;
        planetArray.push(planet);
    }
    
    if (planetArray.length > 5) {
        planetArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }


}

function detectCollision(a, b) {
    return a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&//a's top right corner passes b's top left corner
        a.y < b.y + b.height && //a's top right corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;   //a's bottom left corner passes b's left corner
}