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
var foodpos = [];
var antpos = [];
var createAnt = false;
var paused = false;
var gameover = false;
var score = 0;
var fooditems = [];
var highscore = 0;


	

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

function startpage(){
	
	
	document.getElementById("gametitle").innerHTML = "Ant Scape"
	document.getElementById('exitbutton').style.display = 'none';
	document.getElementById('replaybutton').style.display = 'none';
	document.getElementById('titlepage').style.display = 'block';
	document.getElementById('startCanvas').style.display = 'none';
	document.getElementById('gameCanvas').style.display = 'none';
	document.getElementById('startbutton').style.display = 'block';
	document.getElementById('radio-btn').style.display = 'block';
	document.getElementById('userscore').style.display = 'none';
	
	highscore = +localStorage.getItem("highscore");
	var high = "High Score: " + highscore;
	document.getElementById("highscore").innerHTML = high;
	document.getElementById('startbutton').onclick = function () {
		this.parentNode.style.display = 'none';
		document.getElementById('startCanvas').style.display = 'block';
		document.getElementById('gameCanvas').style.display = 'block';
		onload();
		};  
		
	if (gameover){
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
			canvas = null;
			ctx = null;
			foodpos = [];
			antpos = [];
			createAnt = false;
			paused = false;
			gameover = false;
			time = 60;
			score = 0;
			onload();
		};  
		document.getElementById('exitbutton').onclick = function () {
			canvas = null;
			ctx = null;
			foodpos = [];
			antpos = [];
			createAnt = false;
			paused = false;
			gameover = false;
			time = 60;
			score = 0;
			startpage();
		};  
	
		
		
	}
}

//Setup the canvas and the image of the bug
function onload() {
    // Create the canvas element
    canvas = document.getElementById('gameCanvas');
    canvas.setAttribute('width', WIDTH);
    canvas.setAttribute('height', HEIGHT);

    ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas
    ctx.font = GAME_FONTS;

    // Add event for mouse clicking
    canvas.addEventListener("click", ifclicked, false);

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
        ORANGE_SPEED = ORANGE_SPEED / LEVEL1_BUFF;
        RED_SPEED = RED_SPEED / LEVEL1_BUFF;
        BLACK_SPEED = BLACK_SPEED / LEVEL1_BUFF;
    }
    else if (leveltwo.checked == true) {
        ORANGE_SPEED = ORANGE_SPEED / LEVEL2_BUFF;
        RED_SPEED = RED_SPEED / LEVEL2_BUFF;
        BLACK_SPEED = BLACK_SPEED / LEVEL2_BUFF;
    }
}

function ifclicked(event) {
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
		paused=!paused;
	}

	for ( var i = 0; i < antpos.length; i+=3){
		var distancesquared = Math.sqrt(Math.pow((x - antpos[i]), 2) + Math.pow((y - antpos[i+1]), 2));
		if (distancesquared <= 30) {
            // Add score based on ant level
		    if (antpos[i + 2] == 1) {
		        score+=ORANGE_SCORE;
				fadeout(ORANGE_IMG, antpos[i], antpos[i+1]);
		    }
		    else if (antpos[i + 2] == 2) {
		        score+=RED_SCORE;
				//fadeout(RED_IMG, antpos[i], antpos[i+1]);
		    }
		    else if (antpos[i + 2] == 3) {
		        score+=BLACK_SCORE;
				//fadeout(BLACK_IMG, antpos[i], antpos[i+1]);
		    }
			
			antpos.splice(i, 3);
		}
	}
	
	
	//Set the HighScore within LocalStorage
	highscore = localStorage.getItem("highscore");
	if (score > highscore) {
		localStorage.setItem("highscore", score );
	}		
}
function fadeout(imgpath, x, y){
	
	var img = new Image();
    img.src = imgPath;
    img.width = BUG_WIDTH;
    img.height = BUG_HIGHT;
    ctx.drawImage(img, x, y);
	
	var op = 1;
	function fade()	{
		if ( op > 0.1 ) {
			img.style.opacity = op - 0.3;
			op -= 0.3;
			setInterval(fade, 50);			
		}
	}
}
/**
 * Update the canvas
 */
function draw() {
	
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.fillText("Score: ", 280, 30);
    ctx.fillText(score, 350, 30);
	
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.fillText(time, 50, 30);
	
	ctx.beginPath();
	ctx.rect(170, 15, 5, 15);
	ctx.rect(180, 15, 5, 15);
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
	
    updateFood();
    updateAnts();
	
	
}

/**
 * Update each ant based on their type
 */
function updateAnts() {
    for (var c = 0; c < antpos.length; c += 3) {
        if (antpos[c + 2] == 1) {
            updateAnt(ORANGE_SPEED, ORANGE_IMG, c);
        }
        else if (antpos[c + 2] == 2) {
            updateAnt(RED_SPEED, RED_IMG, c);
        }
        else if (antpos[c + 2] == 3) {
            updateAnt(BLACK_SPEED, BLACK_IMG, c);
        }
    }
}

/**
 * Draw the ant then update the ants position and target
 * @param {float} speed 
 * @param {string} imgPath
 * @param {int} index
 */
function updateAnt(speed, imgPath, index) {
    // Draw the ant image
    var img = new Image();
    img.src = imgPath;
    img.width = BUG_WIDTH;
    img.height = BUG_HIGHT;
    ctx.drawImage(img, antpos[index], antpos[index + 1]);

    // Find the closest food to the ant
    var closestFoodIndex;
    var closestFoodDist = -1
    var dist;
    for (var i = 0; i < foodpos.length; i += 2) {
        dist = getDistance(antpos[index], antpos[index + 1], foodpos[i], foodpos[i + 1]);
        if (closestFoodDist == -1 || closestFoodDist > dist) {
            closestFoodDist = dist;
            closestFoodIndex = i;
        }
    }

    // Move ant towards the food only if it has a target
    if (closestFoodIndex !== undefined) {
        // Normalize
        var xdist = (foodpos[closestFoodIndex] - antpos[index]) / Math.sqrt(closestFoodDist);
        var ydist = (foodpos[closestFoodIndex + 1] - antpos[index + 1]) / Math.sqrt(closestFoodDist);

        // Update Location
        antpos[index] += xdist * speed;
        antpos[index + 1] += ydist * speed;
    }
}

/**
 * Check for bug eating food
 * Draw Food
 */
function updateFood() {
    //Check if any ants are within the perimeter of the food.
    //if so then remove the food.
    for (var c = 0; c < antpos.length; c += 2) {
        for (var i = 0; i < foodpos.length; i += 2) {
            if (antpos[c] + BUG_WIDTH > foodpos[i]
                && antpos[c] < foodpos[i] + FOOD_WIDTH
                && antpos[c + 1] + BUG_HIGHT > foodpos[i + 1]
                && antpos[c + 1] < foodpos[i + 1] + FOOD_HIGHT) {
                foodpos.splice(i, 2);
            }
        }
    }

    //draw the food items.
    for (var m = 0; m < foodpos.length; m += 2) {
        // Draw the ant image
        var img = new Image();
        img.src = FOOD_IMG;
        img.width = FOOD_WIDTH;
        img.height = FOOD_HIGHT;
        ctx.drawImage(img, foodpos[m], foodpos[m + 1]);
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
    //return food.create(randx, randy);
    foodpos.push(randx);
    foodpos.push(randy);
    //---- Food can currently overlap!!
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

function gethighscore (){
	
	if (document.localstorage) {
		highscore = parseInt(localStorage["highscore"] || '0', 10);
	} else {
		// local storage unavailable, set high score to 0
		highscore = 0;
	}	
	
}

function newAnt() {
    if (createAnt == true) {
        // Give the ant a random position to spawn
        antpos.push(ran(X_SPAWN_MIN, X_SPAWN_MAX));
        // Give the ant a y position
        antpos.push(35);
        // Give the ant a random difficulty
        antpos.push(getDifficulty())
        createAnt = false;
    }
}
function settimer() {
    // Reduce time untill it is zero
    if (time > 0) {
        time--;
    }
    // End the game once the time is zero
    else if (time == 0) {
        gameover = true;
    }
}

/*This is a time-based approach to animation
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
        if (gameover) {
            // CODE FOR GAMEOVER HERE
        }
		
		
        else if (!paused) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            newAnt();
            draw();
        }
		if (time == 0 || foodpos.length == 0 ){
			gameover = true;
			paused = true;
			startpage();	
		
		}
		
		
    } else {
        acDelta += delta;
    }
    lastUpdateTime = Date.now();
}
var timer = setInterval(settimer, 1000);
var anttime = setInterval(function () { createAnt = true; },ran(1,3)*1000);
//clearInterval(t);
var fps = setTimeout(update, 1000 / FRAMES);
