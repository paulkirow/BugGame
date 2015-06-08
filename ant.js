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

    /** Objects **/
    canvas,
    ctx,
    clickstate,
    gamestate,
    score,
    highscore,
    timer = {
        time: null,
        paused: true,
        init: function() {
            this.time = TIMER_START;
        },
        pause: function() {
            this.paused = true;
        },
        start: function() {
            this.paused = false;
        }
    },
    food = {
        list: new Array(),
        create: function(x, y) {
            this.list.push({ posx: x, posy: y, eaten: false });
        },
        eat: function() {
            this.list.eaten = true;
        }
    },
    ant = {
        
    };

/**
 * Sets a single food onto a random position within the bounds
 * @returns {food} 
 */
function setFood() {
    // choose a random position
    var randx = Math.round(Math.random() * (X_SPAWN_MAX - X_SPAWN_MIN) + X_SPAWN_MIN - FOOD_WIDTH);
    var randy = Math.round(Math.random() * (Y_SPAWN_MAX - Y_SPAWN_MIN) + Y_SPAWN_MIN - FOOD_HIGHT);
    return food.create(randx, randy);
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

function init() {
    score = 0;
    localStorage["highscore"] = 20;
    // retrive high score from browser storage if it exists
    if (document.localstorage) {
        highscore = parseInt(localStorage["highscore"] || '0', 10);
        alert(highscore);
    } else {
        // local storage unavailable, set high score to 0
        highscore = 0;
    }

    // Initialize the food objects
    for (i = 0; i < FOOD_COUNT; i++) {
        foodlist.push(setFood());
        alert(foodlist[i].eaten);
    }

}

function play() { }

/**
 * Main function for running the game
 */
function main() {
    // Create the canvas element
    canvas = document.createElement("canvas");
    canvas.WIDTH = WIDTH;
    canvas.HEIGHT = HEIGHT;

    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    // add the canvas to the body of the html
    document.body.appendChild(canvas);

    // tracks the mouse activity
    document.addEventListener("mousedown", function(evt) {
        clickstate["X"] = evt.clientX;
        clickstate["Y"] = evt.clientX;
    });

    document.addEventListener("mouseup", function (evt) {
        delete clickstate["X"];
        delete clickstate["Y"];
    });
    alert("test1");
    // initialize the game
    init();
    // start the game
    play();
}