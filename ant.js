var 
    /** Constants **/
    WIDTH = 400,
    HEIGHT = 600,
    FOOD_WIDTH = 20,
    FOOD_HIGHT = 20,
    BUG_WIDTH = 10,
    BUG_HIGHT = 40,
    SPAWN_MIN = 10,
    SPAWN_MAX = 390,
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
    timer,
    food,
    ant

function main() {
    // Create the canvas element
    canvas = Document.createElement("canvas");
    canvas.WIDTH = WIDTH;
    canvas.HEIGHT = HEIGHT;
    ctx = canvas.getContext("2d");
    // add the canvas to the body of the html
    Document.body.appendChild(canvas);

    Document.addEventListener("mousedown", function(evt) {
        clickstate["X"] = evt.clientX;
        clickstate["Y"] = evt.clientX;
    });

    Document.addEventListener("mouseup", function (evt) {
        delete clickstate["X"];
        delete clickstate["Y"];
    });
}