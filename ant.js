/** Constants **/
var
WIDTH = 400,
HEIGHT = 640,
FOOD_WIDTH = 20,
FOOD_HIGHT = 20,
BUG_WIDTH = 10,
BUG_HIGHT = 40,
X_SPAWN_MIN = 10,
X_SPAWN_MAX = 390,
Y_SPAWN_MIN = 100,	
Y_SPAWN_MAX = 500,
SPAWN_TIME_MIN = 1,
SPAWN_TIME_MAX = 3,
BLACK_SPEED = 2.5,
BLACK_SCORE = 5,
BLACK_PROBABILITY = 0.3,
BLACK_IMG = "ant3.png",
RED_SPEED = 1.25,
RED_SCORE = 3,
RED_PROBABILITY = 0.3,
RED_IMG = "ant2.png",
ORANGE_SPEED = 1,
ORANGE_SCORE = 1,
ORANGE_PROBABILITY = 0.4,
ORANGE_IMG = "ant1.png",
FOOD_IMG = "food.png",
FOOD_COUNT = 5,
LEVEL1_BUFF = 1.0,
LEVEL2_BUFF = 0.75,
FADE_TIME = 2,
GAME_FONTS = "bold 20px sans-serif",
FRAMES = 60;

var time = 60;
var canvas = null;
var ctx = null;
var foodPos = [];
var antList = [];
var deadAnt = [];
var createAnt = false;
var paused = false;
var gameover = false;
var score = 0;
var highscore = 0;
var sOrange;
var sRed;
var sBlack;
var ant = function (x, y, img, speed, point) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.speed = speed;
    this.score = point;
    this.rotation = 0;
};

	

/*Setup the animation frame for each browser
* set the callback to 60FPS
* Ref: http://buildnewgames.com/dom-sprites/
*/
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 10);
            };
})();

function load() {
    // Draws main page with high score	
	document.getElementById("gametitle").innerHTML = "Ant Scape"
	document.getElementById('exitbutton').style.display = 'none';
	document.getElementById('replaybutton').style.display = 'none';
	document.getElementById('titlepage').style.display = 'block';
	document.getElementById('startCanvas').style.display = 'none';
	document.getElementById('gameCanvas').style.display = 'none';
	document.getElementById('startbutton').style.display = 'block';
	document.getElementById('radio-btn').style.display = 'block';
	document.getElementById('userscore').style.display = 'none';
	
    // Get the high score
	highscore = +localStorage.getItem("highscore");
	var high = "High Score: " + highscore;
	document.getElementById("highscore").innerHTML = high;

	// Command to start/restart the game
	document.getElementById('startbutton').onclick = function () {
	    this.parentNode.style.display = 'none';
	    document.getElementById('startCanvas').style.display = 'block';
	    document.getElementById('gameCanvas').style.display = 'block';
	    start();
	};
	
	if (gameover) {
        // Draws game over page
		document.getElementById("gametitle").innerHTML = "Game Over"
		document.getElementById('exitbutton').style.display = 'block';
		document.getElementById('replaybutton').style.display = 'block';
		document.getElementById('titlepage').style.display = 'block';
		document.getElementById('startCanvas').style.display = 'none';
		document.getElementById('gameCanvas').style.display = 'none';
		document.getElementById('radio-btn').style.display = 'none';
		document.getElementById('startbutton').style.display = 'none';
		document.getElementById('userscore').style.display = 'block';
		document.getElementById("userscore").innerHTML = "Your Score: " + score;
		document.getElementById('replaybutton').onclick = function () {
		    this.parentNode.style.display = 'none';
		    document.getElementById('startCanvas').style.display = 'block';
		    document.getElementById('gameCanvas').style.display = 'block';
		    refresh()
		    start();
		};
		document.getElementById('exitbutton').onclick = function () {
		    refresh()
		    load();
		};
	}
}

function refresh() {
    canvas = null;
    ctx = null;
    foodPos = [];
    antList = [];
    createAnt = false;
    paused = false;
    gameover = false;
    time = 60;
    score = 0;
}

//Setup the canvas and the image of the bug
function start() {
    // Create the canvas element
    canvas = document.getElementById('gameCanvas');
    canvas.setAttribute('width', WIDTH);
    canvas.setAttribute('height', HEIGHT);

    ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas
    ctx.font = GAME_FONTS;

    // Add event for mouse clicking
    canvas.addEventListener("click", ifClicked, false);

    draw();

    // set the food
    for (var i = 0; i < FOOD_COUNT; i++) {
        setFood();
    }

    // Change the speeds based on the level
    var levelone = document.getElementById("radio-one");
    var leveltwo = document.getElementById("radio-two");
    if (levelone.checked == true)
    {
        sOrange = ORANGE_SPEED / LEVEL1_BUFF;
        sRed = RED_SPEED / LEVEL1_BUFF;
        sBlack = BLACK_SPEED / LEVEL1_BUFF;
    }
    else if (leveltwo.checked == true) {
        sOrange = ORANGE_SPEED / LEVEL2_BUFF;
        sRed = RED_SPEED / LEVEL2_BUFF;
        sBlack = BLACK_SPEED / LEVEL2_BUFF;
    }
}

function ifClicked(event) {
    // Identify the x anf y coordinates
    if (event.x != undefined && event.y != undefined) {
        x = event.x;
        y = event.y;
    } else { // Firefox method to get the position
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
	
	// Check is the click was in bounds of the pause button
	if ( x >= 160 && x <= 190 && y >= 20 && y <= 40 ){
	    paused = !paused;
	}

	if (!paused) {
	    for (var i = 0; i < antList.length; i++) {
	        var distancesquared = Math.sqrt(Math.pow((x - antList[i].x), 2) + Math.pow((y - antList[i].y), 2));
	        if (distancesquared <= 30) {
	            // Add score based on ant level
	            score += antList[i].score;
	            deadAnt.push(antList[i].x);
	            deadAnt.push(antList[i].y);
	            deadAnt.push(antList[i].img);
	            deadAnt.push(antList[i].rotate);
	            deadAnt.push(1); // Opacity
                // Remove dead ant
	            antList.splice(i, 1);
	        }
	    }

	    //Set the HighScore within LocalStorage
	    highscore = localStorage.getItem("highscore");
	    if (score > highscore) {
	        localStorage.setItem("highscore", score);
	    }
	}
}

/**
 * Update the canvas
 */
function draw() {
	
    // Draw the score at the top
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillText("Score: ", 280, 30);
    ctx.fillText(score, 350, 30);
	
    // Write the time at the top
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillText(time, 50, 30);
	
    // Draw the pause button
    ctx.beginPath();
    ctx.rect(170, 16, 5, 16);
    ctx.rect(180, 16, 5, 16);
    ctx.fillStyle = 'black';
    ctx.fill();
    
    ctx.beginPath();
    ctx.rect(0, 0, WIDTH, 40);
    ctx.fillStyle = 'white';
    ctx.fill();

	ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(WIDTH, 40);
    ctx.stroke();
	
    updateDeadAnts();
    updateFood();
    updateAnts();	
}

function updateDeadAnts() {
    for (var c = 0; c < deadAnt.length; c += 5) {
        if (deadAnt[c + 4] > 0) {
            var img = new Image();
            img.src = deadAnt[c + 2];
            img.width = BUG_WIDTH;
            img.height = BUG_HIGHT;

            // Rotate, fate, and draw image
            ctx.save();
            ctx.translate(deadAnt[c], deadAnt[c + 1]);
            ctx.rotate(deadAnt[c + 3]);
            ctx.globalAlpha = deadAnt[c + 4];
            ctx.drawImage(img, 0, 0);
            ctx.globalAlpha = 1;
            ctx.restore();

            deadAnt[c + 4] -= (1 / FRAMES * FADE_TIME);
        }
        else {
            deadAnt.splice(c, 5);
        }
    }
}

function newAnt() {
    if (createAnt == true) {
        // Crate a new ant and add it to the list of ants
        var d = getDifficulty();
        if (d == 1) {
            antList.push(new ant(ran(X_SPAWN_MIN, X_SPAWN_MAX), 30, ORANGE_IMG, sOrange, ORANGE_SCORE));
        }
        else if (d == 2)
        {
            antList.push(new ant(ran(X_SPAWN_MIN, X_SPAWN_MAX), 30, RED_IMG, sRed, RED_SCORE));
        }
        else if (d == 3) {
            antList.push(new ant(ran(X_SPAWN_MIN, X_SPAWN_MAX), 30, BLACK_IMG, sBlack, BLACK_SCORE));
        }
        // Mark ant as spawned
        createAnt = false;
    }
}

/**
 * Update each ant based on their type
 */
function updateAnts() {
    for (var c = 0; c < antList.length; c++) {
        updateAnt(antList[c]);
    }
}

/**
 * Draw the ant then update the ants position and target
 * @param {ant} a
 */
function updateAnt(a) {

    var closestFoodIndex;
    var closestFoodDist = -1
    var dist;
    // Find the closest food to the ant
    for (var i = 0; i < foodPos.length; i += 2) {
        dist = getDistance(a.x, a.y, foodPos[i], foodPos[i + 1]);
        if (closestFoodDist == -1 || closestFoodDist > dist) {
            closestFoodDist = dist;
            closestFoodIndex = i;
        }
    }

    // Normalize
    var xdist = (foodPos[closestFoodIndex] + FOOD_HIGHT / 2 - a.x) / Math.sqrt(closestFoodDist);
    var ydist = (foodPos[closestFoodIndex + 1] + FOOD_WIDTH / 2 - a.y) / Math.sqrt(closestFoodDist);

    // Update Location
    a.x += xdist * a.speed;
    a.y += ydist * a.speed;

    // Draw the ant image
    var img = new Image();
    img.src = a.img;
    img.width = BUG_WIDTH;
    img.height = BUG_HIGHT;

    // Save the rotation
    a.rotate = Math.atan2(ydist, xdist) + 3 * Math.PI / 2;

    // Rotate ant in cavas to face its target food
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(a.rotate);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
}

/**
 * Check for bug eating food
 * Draw Food
 */
function updateFood() {
    // Check if any ants are within the perimeter of the food.
    // if so then remove the food.
    for (var c = 0; c < antList.length; c++) {
        for (var i = 0; i < foodPos.length; i += 2) {
            if (antList[c].x + BUG_WIDTH > foodPos[i]
                && antList[c].x < foodPos[i] + FOOD_WIDTH
                && antList[c].y + BUG_HIGHT > foodPos[i + 1]
                && antList[c].y < foodPos[i + 1] + FOOD_HIGHT) {
                foodPos.splice(i, 2);
            }
        }
    }

    for (var m = 0; m < foodPos.length; m += 2) {
        // Draw the food image
        var img = new Image();
        img.src = FOOD_IMG;
        img.width = FOOD_WIDTH;
        img.height = FOOD_HIGHT;
        ctx.drawImage(img, foodPos[m], foodPos[m + 1]);
    }
}
		

/**
 * Sets a single food onto a random position within the bounds
 * of the spawn limits and width/height
 * @returns {food} 
 */
function setFood() {
    var randx = Math.round(Math.random() * (X_SPAWN_MAX - X_SPAWN_MIN - FOOD_WIDTH) + X_SPAWN_MIN);
    var randy = Math.round(Math.random() * (Y_SPAWN_MAX - Y_SPAWN_MIN - FOOD_HIGHT) + Y_SPAWN_MIN);
    foodPos.push(randx);
    foodPos.push(randy);
}

/**
 * find a random number within a range
 * @param {int} max 
 * @param {int} min
 * @returns {int} 
 */
function ran(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * find a random number within a range
 * @param {int} max 
 * @param {int} min
 * @returns {int} 
 */
function getDifficulty() {
    var ran = Math.random(); 
    if (ran < ORANGE_PROBABILITY) {
        return 1;
    }
    if (ran < ORANGE_PROBABILITY + RED_PROBABILITY){
        return 2;
    }
    if (ran < ORANGE_PROBABILITY + RED_PROBABILITY + BLACK_PROBABILITY) {
        return 3;
    }
    return 1;
}

/**
 * Calculates the distance squared between a given ant and a given food
 * @param {int} antx 
 * @param {int} anty 
 * @param {int} foodx 
 * @param {int} foody 
 * @returns {int} 
 */
function getDistance(antx, anty, foodx, foody) {
    return Math.pow(antx - foodx, 2) + Math.pow(anty - foody, 2);
}

function getHighScore (){
	
	if (document.localstorage) {
		highscore = parseInt(localStorage["highscore"] || '0', 10);
	} else {
		// local storage unavailable, set high score to 0
		highscore = 0;
	}	
	
}

function setTimer() {
    // Reduce time untill it is zero
    if (!paused && time > 0) {
        time--;
    }
}

function drawPlay() {
    ctx.clearRect(170, 5, 20, 30);
    ctx.beginPath();
    ctx.moveTo(170, 15);
    ctx.lineTo(185, 23);
    ctx.lineTo(170, 31);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();
}

/*
* This is a time-based approach to animation
* Found here: http://buildnewgames.com/dom-sprites/
* It calculates how long the last frame took to load
* then sets the load time of the next frame to match
* if you are slower computer or a faster computer
* the objects on the canvas move the same distance
* the game effectively does not slow down.
*/
var lastUpdateTime = 0;
var acDelta = 0;
var msPerFrame = 10;
function update() {

    window.requestAnimationFrame(update);

    var delta = Date.now() - lastUpdateTime;

    if (acDelta > msPerFrame) {
        acDelta = 0;

        //Check to see if food is eaten then stops drawing the canvas.
        if (!paused) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            newAnt();
            draw();
        }
        else {
            drawPlay();
        }
        if (time == 0 || foodPos.length == 0) {
            gameover = true;
            paused = true;
            load();
        }
    } else {
        acDelta += delta;
    }
    lastUpdateTime = Date.now();
}

var timer = setInterval(setTimer, 1000);
var antTime = setInterval(function () { createAnt = true; }, ran(1, 3) * 1000);
var fps = setTimeout(update, 1000 / FRAMES);
