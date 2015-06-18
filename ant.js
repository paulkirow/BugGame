
var
/** Constants **/
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
BLACK_SPEED = 150,
BLACK_SCORE = 150,
BLACK_PROBABILITY = 150,
RED_SPEED = 75,
RED_SCORE = 75,
RED_PROBABILITY = 75,
ORANGE_SPEED = 60,
ORANGE_SCORE = 60,
ORANGE_PROBABILITY = 60,
FOOD_COUNT = 5,
LEVEL1_BUFF = 1.0,
LEVEL2_BUFF = 0.75,
FADE_TIME = 2,
TIMER_START = 60,
GAME_FONTS = "bold 20px sans-serif";

var canvas = null;
var img = null;
var ctx = null;
var imageReady = false;
var WIDTH = 400;
var HEIGHT = 600;
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

    img = new Image();
    img.src = 'ant.jpg';
    img.width = BUG_WIDTH;
    img.height = BUG_HIGHT;

    newant();
    redraw();

    //set the food
    for (var i = 0; i < 10; i++) {
        foodpos.push(ran(50, 350));
    }
    fooditems = ["food1", "food2", "food3", "food4", "food5"];
}
//draw the objects on the cavas and redraw everytime it is called.
//ref http://miloq.blogspot.ca/
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

    var distancesquared = Math.sqrt(Math.pow((x - antpos[0]), 2) + Math.pow((y - antpos[1]), 2));
    if (distancesquared <= 30) {
        antcount--;
        score++;
        antpos.splice(0, 2);
    }
}
function redraw() {

    setfood();
    setants();

    for (var c = 0; c < antpos.length; c += 2) {
        ctx.drawImage(img, antpos[c], antpos[c + 1]);
    }


    var closer = 1;
    var far = 3;

    for (var i = 0; i < 3; i++) {
        if (foodpos[closer] < foodpos[far]) {
            far += 2;
        } else {
            closer = far;
            if (far + 2 == "") {
                break;
            } else {
                far += 2;
            }
        }
    }
    foodcloser = closer;

    if (foodpos[foodcloser - 1] > antpos[0]) {
        antpos[0] += 1;
    } else {
        antpos[0] -= 1;
    }
    if (foodpos[foodcloser] > antpos[1]) {
        antpos[1] += 1;
    } else {
        antpos[1] -= 1;
    }
    ctx.fillStyle = "black";
    ctx.fillText(foodpos[foodcloser - 1], 200, 500);
    ctx.fillText(foodpos[foodcloser], 200, 560);
    ctx.fillStyle = "white";
    //	if (foodpos[foodcloser-1]-10 < antpos[0]
    //		&& foodpos[foodcloser]-15 < antpos[1]){
    //			gamestop = true;
    //	}
    setscore();
}
function setscore() {

    ctx.fillStyle = "black";
    ctx.fillText(score, 30, 30);
}

function setants() {
    //find which ants are closet to which foods
    //update their position relative to the foods

}

/*Create an array of the position of the foods.
  Create the food items. */
function setfood() {

    //Check if any ants are within the perimeter of the food.
    //if so then remove the food.
    for (var c = 0; c < antpos.length; c += 2) {
        for (var i = 0; i < foodpos.length; i += 2) {
            if (foodpos[i] <= antpos[c] && foodpos[i] + 20 >= antpos[c]
                && foodpos[i + 1] <= antpos[c + 1] && foodpos[i + 1] + 20 >= antpos[c + 1]) {
                foodpos.splice(i, 2);
            }// if
        } // for
    } // for

    //draw the food items.
    var scnt = 0;
    for (var m = 0; m < foodpos.length; m += 2) {
        fooditems[scnt] = new Path2D;
        fooditems[scnt].rect(foodpos[m], foodpos[m + 1], 20, 20);
        ctx.stroke(fooditems[scnt]);
        scnt++;
    }
}
//find a random number
function ran(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newant() {
    // Give the ant a random position to spawn
    antpos.push(ran(X_SPAWN_MIN, X_SPAWN_MAX));
    // Give the ant
    antpos.push(10);
    antcount++;
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
            redraw();
        }
    } else {
        acDelta += delta;
    }
    lastUpdateTime = Date.now();
}
//var anttime = setInterval(newant,ran(1,3)*1000);
//clearInterval(t);
var fps = setTimeout(update, 1000 / 60);