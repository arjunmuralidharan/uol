/*

Stickman Surfer
by Arjun Muralidharan

Commentary on Extensions
=========================

FOR GRADING

1: Enemies
-------------------------
Enemies were implemented in multiple locations. To do this, I opted for a "pacman" style figure. Given that the enemy needed two states (for looking left and looking right), I used the arc() function and some radian calculations to provide a mouth for the enemy figure. This allowed me to apply some of the mathematical knowledge from other courses. A key challenge was that initially, the player was only "dying" when coming in contact with a specific enemy. This was due to the conditions outlined in the instructional video applying only to a single enemy. To support multiple enemies, I needed to extend the code to check the location of the player with respect to all enemies in the game, using a for loop that executed every frame. An interesting extension would be to add ability to destroy enemies, and hence "delete" the corresponding constructed object instances.

2: Platforms
-------------------------
Platforms were added to make the game more challenging. These were done very simply according to the instructions. A challenge here was again that the character would only respond to the first platform. This was fixed similar to the enemies, by checking contact with all platforms in a loop, every frame. A further challenge was to manage the falling and plummeting states. The character would "land" on the platform, but still be displayed in a falling state. Various conditional statements helped address this. A key learning here was to simplify the number of states possible, and keeping a clear structure on what the conditions for a specific state may be. This got rather complicated with the addition of a "death" state, in addition to falling, jumping and moving states.



EXTRAS (NO EXPECTATION ON GRADING EXCEPT AS PART OF "MAKING IT AWESOME")

3: Sound
-------------------------
I have implemented a sound effect when the character jumps. This was initially easy to implement, by finding a free sound file online and adding it to the jump event. The sound needed to of course be preloaded. Challenges included making the sound play from the start, as it seemed that the sound file was not being loaded in time for the first jump, resuling in a delayed sound effect for the first time a user jumped. Some reordering of the code (i.e., playing the sound first and then executing the jump) helped fix these issues. Further, the sound effect made the application not work when opening the index.html file locally. This allowed me to learn about CORS restrictions in browsers and the difference in serving an application via web server vs. just opening resources locally. 


4: Others
-------------------------
- The game uses a custom font to display messages. This is packaged with the game and loaded similar to sounds.
- For scoring, a heart widget is drawn to display lives
- When the character dies, they turn into a little grave with a cross (unless they fall down a canyon)


*/

// ----------------------------------
// Global Variables
// ----------------------------------

// Game World Configuration
let floorPosY;
let scrollPos;

// Character Positioning
let gameCharX;
let gameCharY;
let isLeft;
let isRight;
let isFalling;
let isPlummeting;
let gameCharWorldX;

// Character Rise & Fall
let jumpHeight;
let fallRate;

// Game World Objects
let treePosX;
let treePosY;
let clouds;
let mountains;
let collectable;
let canyons;
let flagPole;
let platforms;

// Scoring & Lives
let gameScore;
let scoreIcon;
let lives;
let livesPos;
let gameOver;
let killedByEnemy;

// Enemies
let enemies;

// Sound & Font
let jumpSound;
let gameFont;

function preload() {
	// Load Sound for Jumping
	soundFormats("mp3", "wav");
	jumpSound = loadSound("assets/jump.wav");
	jumpSound.setVolume(0.1);

	// Load game font for on-screen messages
	gameFont = loadFont("assets/PressStart2P.ttf");
}

function setup() {
	createCanvas(1024, 576);

	// Set the height of the ground
	floorPosY = (height * 3) / 4;

	// Initialise lives
	lives = 3;
	gameOver = false;

	// Initialise collectables
	// These are placed in setup() so that they don't reset after you lose a life
	collectable = [
		{
			x_pos: 180,
			y_pos: floorPosY - 130,
			size: 30
		},

		{
			x_pos: 800,
			y_pos: floorPosY - 15,
			size: 30
		},

		{
			x_pos: -430,
			y_pos: floorPosY - 40,
			size: 30
		},

		{
			x_pos: 1530,
			y_pos: floorPosY - 130,
			size: 30
		},

		{
			x_pos: 1010,
			y_pos: floorPosY - 280,
			size: 30
		}
	];

	// Initialise scoring and scoreboard
	gameScore = 0;
	scoreIcon = {
		x_pos: 20,
		y_pos: 20,
		size: 12
	};

	startGame();
}

function startGame() {
	// Initialise the state of being killed by an enemy
	killedByEnemy = false;

	// Initialise starting position of the game character
	gameCharX = width / 2;
	gameCharY = floorPosY;

	// Initialise jump height and fall rates
	jumpHeight = 160;
	fallRate = 5;

	// Initialise position for background scrolling
	scrollPos = 0;

	// Initialise the real position of the gameChar in the game world, required for scrolling
	gameCharWorldX = gameCharX - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// ---------------------
	// Scenery
	// ---------------------

	// Set the height of tree trunks
	treePosY = floorPosY - 145;

	// Initialise array of trees
	treePosX = [-50, -345, -514, -704, 50, 345, 514, 704, 1345, 1514, 1704];

	clouds = [
		{
			x_pos: 100,
			y_pos: 100,
			size: 90
		},

		{
			x_pos: 300,
			y_pos: 170,
			size: 90
		},

		{
			x_pos: 550,
			y_pos: 130,
			size: 90
		},

		{
			x_pos: 800,
			y_pos: 160,
			size: 90
		},

		{
			x_pos: -100,
			y_pos: 100,
			size: 90
		},

		{
			x_pos: -300,
			y_pos: 170,
			size: 90
		},

		{
			x_pos: -550,
			y_pos: 130,
			size: 90
		},

		{
			x_pos: -800,
			y_pos: 160,
			size: 90
		},

		{
			x_pos: 900,
			y_pos: 100,
			size: 90
		},

		{
			x_pos: 1300,
			y_pos: 170,
			size: 90
		},

		{
			x_pos: 1550,
			y_pos: 130,
			size: 90
		},

		{
			x_pos: 1800,
			y_pos: 160,
			size: 90
		}
	];

	// Initialise array of mountains
	mountains = [
		{
			x_pos: 300,
			height: 150,
			width: 80
		},

		{
			x_pos: 700,
			height: 150,
			width: 80
		},

		{
			x_pos: -300,
			height: 150,
			width: 80
		},

		{
			x_pos: -700,
			height: 150,
			width: 80
		},

		{
			x_pos: 1300,
			height: 150,
			width: 80
		},

		{
			x_pos: 1700,
			height: 150,
			width: 80
		}
	];

	// Initialise array of canyons
	canyons = [
		{
			x_pos: 140,
			width: 80
		},

		{
			x_pos: 580,
			width: 100
		},

		{
			x_pos: -450,
			width: 50
		}
	];

	// Initialise the flagpole object
	flagPole = {
		x_pos: 2000,
		isReached: false,
		poleHeight: 100,
		poleWidth: 10,
		flagHeight: 40,
		flagWidth: 50
	};

	// Initialise platforms to jump on
	platforms = [];
	platforms.push(platform(130, 320, 100));
	platforms.push(platform(1000, 370, 100));
	platforms.push(platform(1100, 250, 100));
	platforms.push(platform(980, 170, 60));

	// Initialise enemies that can kill you
	enemies = [];
	enemies.push(new Enemy(300, floorPosY - 25, 90));
	enemies.push(new Enemy(-500, floorPosY - 25, 200));
	enemies.push(new Enemy(1100, floorPosY - 200, 140));
}

function draw() {
	// Fill the sky blue
	background(172, 225, 230);

	// Draw some green ground
	noStroke();
	fill(81, 169, 60);
	rect(0, floorPosY, width, height / 4);

	// Persist the background for scrolling effect
	push();
	translate(scrollPos, 0);

	// Draw clouds
	drawClouds();

	// Draw mountains
	drawMountains();

	// Draw trees
	drawTrees();

	// Draw canyons
	for (let i = canyons.length - 1; i >= 0; i--) {
		checkCanyon(canyons[i]);
		drawCanyon(canyons[i]);
	}

	// Draw collectable items.
	for (let i = collectable.length - 1; i >= 0; i--) {
		if (collectable[i].isFound !== true) {
			checkCollectable(collectable[i]);
			drawCollectable(collectable[i]);
		}
	}

	// Draw the flagpole
	if (flagPole.isReached == false) {
		checkFlagpole();
	}
	renderFlagpole();

	// Draw enemies using a constructor function
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].draw();

		if (enemies[i].checkContact(gameCharWorldX, gameCharY)) {
			killedByEnemy = true;
		}
	}

	// Draw platforms using factory function
	for (let i = 0; i < platforms.length; i++) {
		platforms[i].draw();
	}

	pop();

	// Draw game character
	drawGameChar();

	// Display Scoreboard
	textAlign(LEFT);
	noStroke();
	drawCollectable(scoreIcon);
	fill(0);
	textFont(gameFont);
	textStyle(BOLD);
	textSize(14);
	text(gameScore, 30, 25);

	// Check if the player is dead and update the number of lives
	checkPlayerDie();

	// Draw the lives counter as little red hearts
	// The lives counter re-uses size and vertical position of score
	// This allows changing the size of both consistent with each other
	livesPos = width - 80;
	fill(255, 0, 0);
	drawHearts(livesPos, scoreIcon.y_pos, scoreIcon.size);

	// GAME OVER - if the player has no lives left, show a message and end the game
	if (lives < 1) {
		textSize(30);
		textAlign(CENTER);
		fill(255, 115, 93);
		strokeWeight(10);
		stroke(255, 255, 255);
		text("Game Over. \n Hit Space to Continue.", width / 2, height / 2);
		gameOver = true;
		drawGameChar();
		return;
	}

	// LEVEL COMPLETE - if the player has reached the flagpole, show a message and end the game
	if (flagPole.isReached) {
		textSize(30);
		textAlign(CENTER);
		fill(255, 115, 93);
		strokeWeight(10);
		stroke(255, 255, 255);
		text("Level complete.\n Hit Space to Continue.", width / 2, height / 2);
		while (gameCharY < floorPosY) {
			gameCharY += fallRate;
		}
		isPlummeting = false;
		gameOver = true;
	}

	// Make the game character move or the background scroll
	// Moving left
	if (isLeft && isPlummeting !== true && gameOver == false) {
		if (gameCharX > width * 0.2) {
			gameCharX -= 5;
		} else {
			scrollPos += 5;
		}
	}

	// Moving right
	if (isRight && isPlummeting !== true && gameOver == false) {
		if (gameCharX < width * 0.8) {
			gameCharX += 5;
		} else {
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Make the game character fall down and land on platforms
	if (isPlummeting == true) {
		gameCharY += fallRate;
	}

	if (gameCharY < floorPosY) {
		let isContact = false;
		for (let i = 0; i < platforms.length; i++) {
			if (platforms[i].checkContact(gameCharWorldX, gameCharY)) {
				isContact = true;
				isFalling = false;
				break;
			}
		}
		if (isContact == false) {
			isFalling = true;
			gameCharY += fallRate;
		}
	} else if (gameCharY > floorPosY) {
		isFalling = true;
	} else {
		isFalling = false;
	}

	// Update real position of gameChar for collision detection.
	gameCharWorldX = gameCharX - scrollPos;
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed() {
	// Right arrow key moves right
	if (keyCode == 39 && gameOver != true) {
		isRight = true;
	}

	// Left arrow key moves left
	if (keyCode == 37 && gameOver != true) {
		isLeft = true;
	}

	// Space Bar and Up arrow key jumps
	if (
		(keyCode == 32 || keyCode == 38) &&
		isFalling == false &&
		isPlummeting == false &&
		gameOver !== true
	) {
		jumpSound.play();
		gameCharY -= jumpHeight;
	}

	// Space Bar restarts game if the game is over
	if (keyCode == 32 && gameOver) {
		setup();
	}
}

function keyReleased() {
	// When releasing the left of right arrow keys, go back to the default state
	if (keyCode == 37) {
		isLeft = false;
	}

	if (keyCode == 39) {
		isRight = false;
	}
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
	if (gameCharY <= floorPosY && flagPole.isReached == false && gameOver) {
		noStroke();

		fill(0, 98, 70);
		rect(gameCharX, floorPosY - 60, 10, 60);
		rect(gameCharX - 15, floorPosY - 45, 40, 10);
		fill(149, 104, 28);
		arc(gameCharX + 5, floorPosY + 1, 40, 40, PI, 0);
	} else if (isLeft && isFalling && gameOver == false) {
		stroke(255, 152, 0);
		strokeWeight(4);
		fill(255, 209, 64);

		// Draw Stickman
		ellipse(gameCharX, gameCharY - 50, 30, 30);								// Head
		line(gameCharX, gameCharY - 35, gameCharX, gameCharY - 10);				// Body
		line(gameCharX - 10, gameCharY - 20, gameCharX + 10, gameCharY - 25);	// Arms
		line(gameCharX - 10, gameCharY - 10, gameCharX + 10, gameCharY - 10);	// Legs
		fill(0);																// Eyes
		ellipse(gameCharX - 8, gameCharY - 50, 2, 2);
		ellipse(gameCharX + 2, gameCharY - 50, 2, 2);

		// Reset the Stroke Weight
		strokeWeight(1);
	} else if (isRight && isFalling && gameOver == false) {
		stroke(255, 152, 0);
		strokeWeight(4);
		fill(255, 209, 64);

		// Draw Stickman
		ellipse(gameCharX, gameCharY - 50, 30, 30);			
		line(gameCharX, gameCharY - 35, gameCharX, gameCharY - 10);	
		line(gameCharX - 10, gameCharY - 25, gameCharX + 10, gameCharY - 20);
		line(gameCharX - 10, gameCharY - 10, gameCharX + 10, gameCharY - 10);
		fill(0);		// Eyes
		ellipse(gameCharX - 2, gameCharY - 50, 2, 2);
		ellipse(gameCharX + 8, gameCharY - 50, 2, 2);

		// Reset the Stroke Weight
		strokeWeight(1);
	} else if (isLeft) {
		stroke(255, 152, 0);
		strokeWeight(4);
		fill(255, 209, 64);

		// Draw Stickman
		ellipse(gameCharX, gameCharY - 50, 30, 30);
		line(gameCharX, gameCharY - 35, gameCharX, gameCharY - 10);
		line(gameCharX - 10, gameCharY - 20, gameCharX + 10, gameCharY - 25);
		line(gameCharX, gameCharY - 10, gameCharX - 10, gameCharY);
		line(gameCharX, gameCharY - 10, gameCharX + 10, gameCharY);
		fill(0);
		ellipse(gameCharX - 8, gameCharY - 50, 2, 2);
		ellipse(gameCharX + 2, gameCharY - 50, 2, 2);

		// Reset the Stroke Weight
		strokeWeight(1);
	} else if (isRight) {
		stroke(255, 152, 0);
		strokeWeight(4);
		fill(255, 209, 64);

		// Draw Stickman
		ellipse(gameCharX, gameCharY - 50, 30, 30);
		line(gameCharX, gameCharY - 35, gameCharX, gameCharY - 10);
		line(gameCharX - 10, gameCharY - 25, gameCharX + 10, gameCharY - 20);
		line(gameCharX, gameCharY - 10, gameCharX - 10, gameCharY);
		line(gameCharX, gameCharY - 10, gameCharX + 10, gameCharY);
		fill(0);
		ellipse(gameCharX - 2, gameCharY - 50, 2, 2);
		ellipse(gameCharX + 8, gameCharY - 50, 2, 2);

		// Reset the Stroke Weight
		strokeWeight(1);
	} else if (isFalling || isPlummeting) {
		stroke(255, 152, 0);
		strokeWeight(4);
		fill(255, 209, 64);

		// Draw Stickman
		ellipse(gameCharX, gameCharY - 50, 30, 30);
		line(gameCharX, gameCharY - 35, gameCharX, gameCharY - 10);
		line(gameCharX - 10, gameCharY - 25, gameCharX + 10, gameCharY - 25);
		line(gameCharX - 10, gameCharY - 10, gameCharX + 10, gameCharY - 10);
		fill(0);
		ellipse(gameCharX - 5, gameCharY - 50, 2, 2);
		ellipse(gameCharX + 5, gameCharY - 50, 2, 2);

		// Reset the Stroke Weight
		strokeWeight(1);
	} else {
		stroke(255, 152, 0);
		strokeWeight(4);
		fill(255, 209, 64);

		// Draw Stickman
		ellipse(gameCharX, gameCharY - 50, 30, 30);
		line(gameCharX, gameCharY - 35, gameCharX, gameCharY - 10);
		line(gameCharX - 10, gameCharY - 25, gameCharX + 10, gameCharY - 25);
		line(gameCharX, gameCharY - 10, gameCharX - 10, gameCharY);
		line(gameCharX, gameCharY - 10, gameCharX + 10, gameCharY);
		fill(0);
		ellipse(gameCharX - 5, gameCharY - 50, 2, 2);
		ellipse(gameCharX + 5, gameCharY - 50, 2, 2);

		// Reset the Stroke Weight
		strokeWeight(1);
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds() {
	for (let i = clouds.length - 1; i >= 0; i--) {
		fill(248, 248, 248);
		ellipse(
			clouds[i].x_pos,
			clouds[i].y_pos,
			clouds[i].size,
			clouds[i].size
		);
		ellipse(
			clouds[i].x_pos + clouds[i].size / 2,
			clouds[i].y_pos,
			clouds[i].size,
			clouds[i].size
		);
		ellipse(
			clouds[i].x_pos + clouds[i].size,
			clouds[i].y_pos,
			clouds[i].size,
			clouds[i].size
		);
		ellipse(
			clouds[i].x_pos + clouds[i].size / 2,
			clouds[i].y_pos - clouds[i].size * 0.4,
			clouds[i].size,
			clouds[i].size
		);
	}
}

// Function to draw mountains objects.

function drawMountains() {
	for (let i = mountains.length - 1; i >= 0; i--) {
		fill(129, 176, 210);
		triangle(
			mountains[i].x_pos,
			floorPosY,
			mountains[i].x_pos + mountains[i].width,
			mountains[i].height,
			mountains[i].x_pos + mountains[i].width * 2,
			floorPosY
		);
		fill(182, 211, 214);
		triangle(
			mountains[i].x_pos + 60,
			floorPosY,
			mountains[i].x_pos + mountains[i].width + 60,
			mountains[i].height * 1.6,
			mountains[i].x_pos + mountains[i].width * 2 + 60,
			floorPosY
		);
		fill(255);
	}
}

// Function to draw trees objects.
function drawTrees() {
	for (let i = treePosX.length - 1; i >= 0; i--) {
		fill(120, 247, 75);
		strokeWeight(0.2);
		stroke(53, 114, 34);
		ellipse(treePosX[i] + 25, treePosY, 150, 180);
		noStroke();
		fill(187, 89, 60);
		rect(treePosX[i], treePosY + 41, 50, 105);
		triangle(
			treePosX[i],
			treePosY + 41,
			treePosX[i] - 27,
			treePosY + 41 - 38,
			treePosX[i] + 48,
			treePosY + 41
		);
		triangle(
			treePosX[i],
			treePosY + 41,
			treePosX[i] + 27 + 50,
			treePosY + 41 - 38,
			treePosX[i] + 50,
			treePosY + 41
		);
	}
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon) {
	fill(172, 225, 230);
	rect(t_canyon.x_pos, floorPosY, t_canyon.width, height - floorPosY);
	fill(72,157,242);
	ellipse(
		t_canyon.x_pos + t_canyon.width / 8,
		floorPosY + 144,
		t_canyon.width / 4,
		20
	);
	ellipse(
		t_canyon.x_pos + (t_canyon.width / 8) * 3,
		floorPosY + 144,
		t_canyon.width / 4,
		20
	);
	ellipse(
		t_canyon.x_pos + (t_canyon.width / 8) * 5,
		floorPosY + 144,
		t_canyon.width / 4,
		20
	);
	ellipse(
		t_canyon.x_pos + (t_canyon.width / 8) * 7,
		floorPosY + 144,
		t_canyon.width / 4,
		20
	);
}

// Function to check if character is over a canyon.

function checkCanyon(t_canyon) {
	let overCanyon =
		gameCharWorldX > t_canyon.x_pos &&
		gameCharWorldX < t_canyon.x_pos + t_canyon.width;
	if (overCanyon == true && gameCharY >= floorPosY) {
		isPlummeting = true;
	}
}

// --------------------------------------------
// Collectable items render and check functions
// --------------------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {
	fill(220, 0, 0);
	ellipse(
		t_collectable.x_pos,
		t_collectable.y_pos,
		t_collectable.size,
		t_collectable.size
	);
	fill(124, 94, 0);
	rect(
		t_collectable.x_pos - t_collectable.size / 10,
		t_collectable.y_pos - t_collectable.size / 1.2,
		t_collectable.size / 6,
		t_collectable.size / 3
	);
	fill(50, 145, 0);
	ellipse(
		t_collectable.x_pos + t_collectable.size / 5,
		t_collectable.y_pos - t_collectable.size / 1.2,
		t_collectable.size * 0.6,
		t_collectable.size * 0.3
	);
}

// Function to check if character has collected an item.

function checkCollectable(t_collectable) {
	let collectableRange = dist(
		gameCharWorldX,
		gameCharY,
		t_collectable.x_pos,
		t_collectable.y_pos
	);
	if (collectableRange < 40) {
		t_collectable.isFound = true;
		gameScore += 1;
	}
}

// ----------------------------------
// Flagpole render and check functions
// ----------------------------------

function renderFlagpole() {
	fill(225, 220, 255);
	rect(
		flagPole.x_pos,
		floorPosY - flagPole.poleHeight,
		flagPole.poleWidth,
		flagPole.poleHeight
	);

	// If the player reaches the flagpole, pull the flag down
	if (flagPole.isReached) {
		fill(220, 186, 255);
		rect(
			flagPole.x_pos + flagPole.poleWidth,
			floorPosY - flagPole.flagHeight,
			flagPole.flagWidth,
			flagPole.flagHeight
		);
	} else {
		fill(220, 186, 255);
		rect(
			flagPole.x_pos + flagPole.poleWidth,
			floorPosY - flagPole.poleHeight,
			flagPole.flagWidth,
			flagPole.flagHeight
		);
	}
}

function checkFlagpole() {
	let poleDistance = gameCharWorldX - flagPole.x_pos;
	if (abs(poleDistance) < 20) {
		flagPole.isReached = true;
	}
}

// ----------------------------------
// Lives
// ----------------------------------

// Function to check if the player has died, then respawn or restart game
function checkPlayerDie() {
	// Player is considered dead if they have fallen below the canvas or have been killed by an enemy
	if (gameCharY - 70 > height || killedByEnemy) {
		lives--;

		if (lives > 0) {
			startGame();
		}
	}
}

// Function to draw the lives counter widget on screen (hearts)
function drawHearts(x, y, size) {
	for (let i = 0; i < lives; i++) {
		beginShape();
		vertex(x, y);
		bezierVertex(
			x - size / 2,
			y - size / 2,
			x - size,
			y + size / 3,
			x,
			y + size
		);
		bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
		endShape(CLOSE);
		x += 20; // Sets the spacing between the hearts
	}
}

// ----------------------------------
// Platforms
// ----------------------------------

function platform(x, y, length) {
	let p = {
		x: x,
		y: y,
		length: length,
		draw: function() {
			fill(133, 0, 100);
			rect(this.x, this.y, this.length, 20, 8, 8, 8, 8);
		},
		checkContact: function(gcX) {
			if (gcX > this.x - 10 && gcX < this.x + this.length + 5) {
				let d = this.y - gameCharY;

				if (d >= 0 && d < 4) {
					return true;
				}
			}
			return false;
		}
	};
	return p;
}

// ----------------------------------
// Enemies
// ----------------------------------

// Constructor function to generate enemies
function Enemy(x, y, range) {
	this.x = x;
	this.y = y;
	this.range = range;
	this.lookRight = true;
	this.charContact = false;

	this.currentX = x;
	this.inc = 0.5;
	this.update = function() {
		this.currentX += this.inc;

		if (this.currentX >= this.x + this.range) {
			this.inc = -0.5;
			this.lookRight = false;
		} else if (this.currentX <= this.x) {
			this.inc = 0.5;
			this.lookRight = true;
		}
	};
	this.draw = function() {
		this.update();
		fill(70, 69, 71);
		ellipse(this.currentX, this.y, 30, 30);

		if (this.lookRight) {
			fill(255);
			ellipse(this.currentX + 3, this.y - 8, 5, 5);
			fill(255, 0, 0);
			stroke(70, 69, 71);
			arc(this.currentX, this.y, 30, 30, -0.5, 0.5);
		} else {
			fill(255);
			ellipse(this.currentX - 3, this.y - 8, 5, 5);
			fill(255, 0, 0);
			stroke(70, 69, 71);
			arc(this.currentX, this.y, 30, 30, 2.6, -2.6);
		}
	};
	this.checkContact = function(gcX, gcY) {
		let d = dist(gcX, gcY, this.currentX, this.y);
		if (d < 30) {
			this.charContact = true;
		}

		return this.charContact;
	};
}
