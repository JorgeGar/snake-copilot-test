// Adapted from: https://gist.github.com/straker/ff00b4b49669ad3dec890306d348adc4
var scoreDisplayElem = document.querySelector('.scoreboard');
var hiscoreDisplayElem = document.querySelector('.hi');
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var paused = false;
var grid = 16;
var count = 0;

function resetSnake() {
    var snake = {
        x: 160,
        y: 160,
        dx: grid, // moves one grid length per frame
        dy: 0,
        cells: [], // keep track of all grids occupied by snake
        maxCells: 4, // length of snake, grows when eating apple
    };
    return snake;
}
var snake = resetSnake();
var score = 0;
var hiscore = 0;
var apple = {x: 320, y: 320};

const getRandomInt = (mn, mx) => Math.floor(Math.random() * (mx - mn)) + mn;

function gameLoop() {
    
    requestAnimationFrame(gameLoop);
    if (++count < 4) return;
    if (paused) throwError(); // throw an error to force a pause
    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx; // move snake by its velocity
    snake.y += snake.dy;
    
    // horizontal wrap
    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;

    // vertical wrap
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.width) snake.y = 0;

    //keep track of snake's cells. Head is at front of array.
    snake.cells.unshift({x: snake.x, y: snake.y});

    // remove cells as snake moves away
    if (snake.cells.length > snake.maxCells) snake.cells.pop();

    // draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);

    // draw snake
    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {
        context.fillRect(cell.x, cell.y, grid-1, grid-1) // size of cell -1 for grid effect.
        if (cell.x === apple.x && cell.y == apple.y) {
            snake.maxCells++;
            scoreDisplayElem.innerHTML = ++score;
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
            if (score > hiscore) {
                hiscore = score;
                hiscoreDisplayElem.innerHTML = '' + hiscore;
            }
        }
        // check collision with all cells
        for (var i = index + 1; i < snake.cells.length; i++) {
            // if snake touches itself, reset game
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                scoreDisplayElem.innerHTML = ' 0';
                score = 0;
                snake = resetSnake();
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}

// document.addEventListener('keydown', function(e) {
//     if (e.which === 37) left();
//     else if (e.which === 38) up();
//     else if (e.which === 39) right();
//     else if (e.which === 40) down();
//     else if (e.which === 32) pause();
// });


// function left() {
//     if (snake.dx === 0) {
//         snake.dx = -grid;
//         snake.dy = 0;
//     }
// };
// function right() {
//     if (snake.dx === 0) {
//         snake.dx = grid;
//         snake.dy = 0;
//     }
// };
// function up() {
//     if (snake.dy === 0) {
//         snake.dy = -grid;
//         snake.dx = 0;
//     }
// };
// function down() {
//     if (snake.dy === 0) {
//         snake.dy = grid;
//         snake.dx = 0;
//     }  
// };
// function pause() {
//     paused = !paused;
//     document.querySelector('.pause').innerHTML = paused ? 'Play' : 'Pause';
// }

document.addEventListener('keydown', function(e) {
    switch(e.which) {
        case 37: // left
            if (snake.dx === 0) {
                snake.dx = -grid;
                snake.dy = 0;
            }
            break;
        case 38: // up
            if (snake.dy === 0) {
                snake.dy = -grid;
                snake.dx = 0;
            }
            break;
        case 39: // right
            if (snake.dx === 0) {
                snake.dx = grid;
                snake.dy = 0;
            }
            break;
        case 40: // down
            if (snake.dy === 0) {
                snake.dy = grid;
                snake.dx = 0;
            }
            break;
        case 32: // space
            paused = !paused;
            document.querySelector('.pause').innerHTML = paused ? 'Play' : 'Pause';
            break;
        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});


requestAnimationFrame(gameLoop);
