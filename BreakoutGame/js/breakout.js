//Setup the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Counting score
var score = 0;

//Set the starting point
var x = canvas.width/2;
var y = canvas.height-30;
var dx=2;
var dy=-2;
var ballRadius=10;

var paddleHeight =10;
var paddleWidth =75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

// Set up some Bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth= 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft= 30;



// Hold the bricks in a two dimensional array - think of it as rows and columns.
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
	bricks [c] = [];
	for (r=0; r<brickRowCount; r++) {
		bricks[c][r] = {x:0, y:0, status: 1 };
	}
}

//Game sounds
var WINNING_SOUND = new Audio ('sounds/woohoo.wav');
var SCORE_SOUND = new Audio ('sounds/success.wav');
var GAMEOVER_SOUND = new Audio ('sounds/gameover.wav');


//Draw the ball

function drawBall() {
	ctx.beginPath ();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

//This function draws the bricks
function drawBricks() {
	for(c=0; c<brickColumnCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status == 1) {
			var brickX = (c*(brickWidth+brickPadding))+ brickOffsetLeft;
			var brickY = (r*(brickHeight+brickPadding)) +brickOffsetTop;
			bricks[c][r].x = brickX;
			bricks[c][r].y = brickY;
			ctx.beginPath();
			ctx.rect(brickX, brickY, brickWidth, brickHeight);
			ctx.fillstyle = "#0095DD";
			ctx.fill();
			ctx.closePath();
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "0095DD";
	ctx.fillText = ("Score: "+score, 8, 20);
	document.getElementById("gamescore").innerHTML = "score; " +score;
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	collisionDetection();
	drawBricks();
	drawScore();
	
	x += dx;
	y += dy;

	//Bounce the ball off three walls -if  drops off the bottom - game over
	if (x +dx > canvas.width-ballRadius || x+dx< ballRadius) {
		dx = -dx;
	}

	if (y + dy < ballRadius) {
		dy= -dy;
	}
	else if (y+dy > canvas.height-ballRadius) {
		// Check if the ball is hitting the paddle.
		if (x > paddleX  && x < paddleX + paddleWidth) {
			dy = -dy
		}
		else {
		GAMEOVER_SOUND.play();
		alert("Game Over");
		x = canvas.Width/2;
		y = canvas.Height-30;
		document.location.reload();
		}
	}
	
	if(rightPressed && paddleX <canvas.width-paddleWidth) {
		paddleX +=7;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -=7;
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup" , keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth/2;
	}
}


function keyDownHandler(e) {
		if(e.keyCode ==39){
			rightPressed = true;
		}
		else if (e.keyCode==37) {
			leftPressed = true;
		}
}

function keyUpHandler(e) {
	if(e.keyCode==39) {
		rightPressed = false;
	}
	else if(e.keyCode==37) {
		leftPressed = false;
	}
}

function collisionDetection() {
for(c=0; c<brickColumnCount; c++) {
	for(r=0; r<brickRowCount; r++){
		var b = bricks[c][r];
		if (b.status == 1) {
			if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
				dy = -dy;
				b. status = 0;
				score++;
				SCORE_SOUND.play();
				if (score == brickRowCount*brickColumnCount) {
					WINNING_SOUND.play();
			alert (" YOU WIN, CONGRADULATIONS!");
					document.location.reload();
					}
				}
			}
		}
	}
}

setInterval (draw, 10);