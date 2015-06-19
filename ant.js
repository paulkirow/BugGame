/** Constants **/
var
WIDTH = 400,
HEIGHT = 600,
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
RED_SPEED = 1.25,
RED_SCORE = 3,
RED_PROBABILITY = 0.3,
ORANGE_SPEED = 1,
ORANGE_SCORE = 1,
ORANGE_PROBABILITY = 0.4,
FOOD_COUNT = 5,
LEVEL1_BUFF = 1.0,
LEVEL2_BUFF = 0.75,
FADE_TIME = 2,
TIMER_START = 60,
GAME_FONTS = "bold 20px sans-serif";
LEVEL = 0;

var canvas = null;
var ctx = null;
var imageReady = false;
var foodpos = [];
var antpos = [];
var antcount = 0;
var closer = 1;
var gamestop = false;
var foodcloser = 0;
var score = 0;
var fooditems = [];


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
	
	document.getElementById('startcenter').style.display = 'none';
	document.getElementById('gameCanvas').style.display = 'none';
	var levelone = document.getElementById("radio-one");
	levelone.checked = true; LEVEL = 1;
	var leveltwo = document.getElementById("radio-two");
	leveltwo.checked = true; LEVEL = 2;
	document.getElementById('startbutton').onclick = function () {
		this.parentNode.style.display = 'none';
		document.getElementById('startcenter').style.display = 'block';
		document.getElementById('gameCanvas').style.display = 'block';
		onload();
		};  
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


    newant();
    draw();

    //set the food
    for (var i = 0; i < FOOD_COUNT; i++) {
        setFood();
    }
    fooditems = ["food1", "food2", "food3", "food4", "food5"];
}

function ifclicked(event) {

    if (event.x != undefined && event.y != undefined) {
        x = event.x;
        y = event.y;
    } else { // Firefox method to get the position
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
	
	
	if ( x >= 170 && x <= 180 && y >= 5 && y <= 15 ){
		gamestop=true;
	}
	
	
	
	
	for ( var i = 0; i < antpos.length; i+=2){
		var distancesquared = Math.sqrt(Math.pow((x - antpos[i]), 2) + Math.pow((y - antpos[i+1]), 2));
		if (distancesquared <= 30) {
			antcount--;
			score++;
			antpos.splice(i, 2);
		}
	}
}

//draw the objects on the cavas and draw everytime draw() is called.
//ref http://miloq.blogspot.ca/
function draw() {
	
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.fillText("Score: ", 280, 30);
    ctx.fillText(score, 350, 30);
	
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.fillText(TIMER_START, 50, 30);
	
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

    for (var c = 0; c < antpos.length; c += 3) {
        if (antpos[c+2] == 1)
        {
            updateAnts(ORANGE_SPEED, 'ant.jpg', c);
        }
        else if (antpos[c+2] == 2)
        {
            updateAnts(RED_SPEED, 'ant.jpg', c);
        }
        else if (antpos[c + 2] == 3) {
            updateAnts(BLACK_SPEED, 'ant.jpg', c);
        }
    }
}

function updateAnts(speed, imgPath, index) {
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
        if (foodpos[closestFoodIndex] > antpos[index]) {
            antpos[index] += speed;
        } else {
            antpos[index] -= speed;
        }
        if (foodpos[closestFoodIndex + 1] > antpos[index + 1]) {
            antpos[index + 1] += speed;
        } else {
            antpos[index + 1] -= speed;
        }
    }
    /*deltaY = antpos[c + 1] - foodpos[c + 1];
    deltaX = antpos[c] - foodpos[c];
    angleInDegrees = atan2(deltaY, deltaX) * 180 / math.PI;*/

    //Write target coordinates
//    ctx.fillStyle = "black";
//    ctx.fillText(foodpos[closestFoodIndex], 200, 500);
//    ctx.fillText(foodpos[closestFoodIndex + 1], 200, 560);
//    ctx.fillStyle = "white";
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
 * Create an array of the position of the foods.
 * Create the food items.
 */
function updateFood() {
    //Check if any ants are within the perimeter of the food.
    //if so then remove the food.
    for (var c = 0; c < antpos.length; c += 2) {
        for (var i = 0; i < foodpos.length; i += 2) {
            if (antpos[c] + BUG_WIDTH > foodpos[i]
                && antpos[c] < foodpos[i] + FOOD_WIDTH
                && antpos[c + 1] + BUG_HIGHT > foodpos[i +1]
                && antpos[c + 1] < foodpos[i + 1] + FOOD_HIGHT) {
                foodpos.splice(i, 2);
            }// if
        } // for
    } // for

    //draw the food items.
    var scnt = 0;
    for (var m = 0; m < foodpos.length; m += 2) {
        fooditems[scnt] = new Path2D;
        fooditems[scnt].rect(foodpos[m], foodpos[m + 1], FOOD_WIDTH, FOOD_HIGHT);
        ctx.stroke(fooditems[scnt]);
        scnt++;
    }
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
    if (ran < ORANGE_PROBABILITY + RED_PROBABILITY +BLACK_PROBABILITY) {
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


function newant() {
    // Give the ant a random position to spawn
    antpos.push(ran(X_SPAWN_MIN, X_SPAWN_MAX));
    // Give the ant a y position
    antpos.push(0);
    antpos.push(getDifficulty())
}
function settimer(){
	
	TIMER_START--;
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
        if (!gamestop) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            draw();
        }
    } else {
        acDelta += delta;
    }
    lastUpdateTime = Date.now();
}
var timer = setInterval(settimer, 1000);
var anttime = setInterval(newant,ran(1,3)*1000);
//clearInterval(t);
var fps = setTimeout(update, 1000 / 60);