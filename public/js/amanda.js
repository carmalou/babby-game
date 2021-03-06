// screen Size
var height = window.innerHeight;
var width = window.innerWidth;

// assets
var game;
var amanda;
var background;
var villagers;
var victor;
var ground;
var platforms;
var currentVillager;
var currentVillager2;

// variables
var score = 0;
var scoreText;
var velocity = 200;
var instructions;
var cursors;
var lives = 5;
var livesText;
var centerText;
var started = false;
var instructionPage = 0;
var rawr;
var rawrX = 0.25;
var rawrY = 0.25;
var pauseKey;
var spaceKey;
var enterKey;
var awkwardQuestions = [
	"When is the baby due?", "Are you having a boy or a girl?", "You look like you're ready to pop!", "Can I touch your belly?", "You look so small!", "You look so big!", "Are you pregnant?", "What's the baby doing in there?", "Do you need to sit down?", "Here let me get that for you...", "You must be having a girl because...", "You must be having a boy because...", "Are you sure you aren't having twins??", "Are you old enough to be having a baby?", "Should you be doing this in your condition?", "Are you excited?", "Don't you just LOVE being pregnant?", "How old are you?", "Will you have any more?", "How are you feeling?", "Are you ready?", "Haven't you had that baby yet?", "The secret to raising kids is...", "Remember to sleep when the baby sleeps.", "They grow up so fast...", "You're getting an epidural, right?", "Natural birth is the only way to go.", "Are you married?", "Have you finished the nursery?", "Are you scared?", "I don't have kids, but here's what I think...", "What language are you going to teach him?", "Where is she going to go to college?", "Have you got the preschool picked out yet?", "I knew this one lady who...", "Back in my day...", "Do you think you'll be a good mom?", "Do you have a name picked out yet?", "If you think that's bad, let me tell you...", "If you think pregnancy is bad, wait until the terrible twos!", "This isn't so bad, just wait until she's a teenager!", "It's a good thing you're having a boy, because girl's are the worst!", "It's a good thing you're having a girl, because boys are the worst!", "How many kids do you want?", "Have you read any parenting books?", "What's your parenting style?", "I NEVER did that", "Don't forget to avoid alcohol!", "Make sure you microwave your sandwich meats!", "Don't worry, it gets better."
];
var snarkyAnswers = [
	"NO, you MAY NOT touch my belly!", "NO, I am NOT having twins.", "I do not actually love being pregnant, leave me alone.", "LEAVE ME ALONE!", "You need to be garbage-collected!", "How is this any of your business?", "Can I touch YOUR belly?", "Take that!", "Thank you for your advice,\nperson-I've-never-met-before.", "Pregnant women don't pop -- that's not how this works.", "Why are you asking if I'm scared??\nWhat's wrong with you?", "No, I'm not hungry. Go. Away.", "There isn’t enough Purell to wipe the creepiness off!", "How can I avoid alcohol when I have to talk to you??", "You are causing global warming, because you have me fuming mad!", "I have an app called Decency, and you just broke the build.", "Have you ever even SEEN a child?", "You are lord of the 3-ring-circus", "Who asked you?!", "My baby, my business.", "And who are you? DHS?", "You are being a dark cloud in my array of sunshine.", "Go. Away.", "Oh yeah? How did your kids turn out?", "Maybe you should Google some MANNERS!", "Is it difficult to fit your whole foot into your mouth?"
];

if(isSafari) {
	game = new Phaser.Game(width, height, Phaser.CANVAS, 'midDiv', { preload: preload, create: create, update: update });
} else {
	game = new Phaser.Game(width, height, Phaser.AUTO, 'midDiv', { preload: preload, create: create, update: update });
}

// loads assets
function preload() {

// load my world
game.load.image('background', '/img/kenney_backgroundElements/Samples/colored_talltrees.png');

// load the ground
game.load.image('ground', '/img/ground.png');

// load angry swear words
game.load.image('angry', '/img/angry.png');

// load Amanda
game.load.spritesheet('amanda', '/img/Amanda.png', 64, 64, 260);

// load villain
game.load.spritesheet('victor', '/img/old_man.png', 64, 64, 273);

scoreText = game.add.text(3, 0, 'Score: 0', {fontSize: '2em', fill: '#8B5742'});
livesText = game.add.text(3, 20, 'Patience: 5', {fontSize: '2em', fill: '#8B5742'});

}

function showInstructions() {
	var instructions1 = "Welcome! Press enter to begin.";
	var instructions2 = "Congrats Amanda and Jesse!";
	var instructions3 = "Help Amanda avoid awkward situations!";
	var instructions4 = "In a world where it's culturally appropriate to touch a woman's stomach,\nand ask her awkward questions,\nAmanda needs help stopping these weirdos!";
	var instructions5 = "Run back and forth with your arrow keys to avoid the weirdos.";
	var instructions6 = "If you need a break, you can pause with P.";
	var instructions7 = "Use the down arrow to stop them from coming closer.";
	var instructions8 = "Use the spacebar or up arrow to jump on them for extra points!";
	var instructions9 = "Be careful not to get too close to the weirdos,\nor else you'll have to listen to their unsolicited advice,\nand Amanda will start to lose patience!";
	var instructionList = [instructions1, instructions2, instructions3, instructions4, instructions5, instructions6, instructions7, instructions8, instructions9];

	if (instructionPage < 9) {
		writeCenter(instructionList[instructionPage], 1, null);
		instructionPage++;
		game.paused = true;
	} else {
		centerText.destroy();
		started = true;
	}
}

function create() {
  // load phaser
  game.physics.startSystem(Phaser.Physics.ARCADE);
	game.input.onDown.add(unpause, self);
	// this.game.input.keyboard.onDownCallback = function(event) { // removing this as it breaks the pause button
	// 	unpause(event);
	// 	console.log("I called the pause function");
	// }
	pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
	enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // platforms (in case of obstacles if I have time)
  platforms = game.add.group();
  platforms.enableBody = true;
  ground = platforms.create(0, game.world.height - 136, 'ground');
	ground.scale.x = width / ground.width;
	ground.body.immovable = true;

  // add the player
  amanda = game.add.sprite((game.world.width * .01), (game.world.height - 200), 'amanda');
  game.physics.arcade.enable(amanda);
  amanda.body.collideWorldBounds = true;
	amanda.body.gravity.y = 900;
	amanda.frame = 26;

	// add angry villagers
	villagers = game.add.group();
	villagers.enableBody = true;
	villagers.setAll('checkWorldBounds', true);
	villagers.setAll('outOfBoundsKill', true);
	victor = villagers.create((game.world.width + (game.world.width * .01)), (game.world.height - 200), 'victor');
	victor.body.velocity.x = -200;

	// set timer for villagers to be created
	game.time.events.loop(Phaser.Timer.SECOND, makeVillagers, this);


  // add in background
  background = game.add.tileSprite(0, 0, game.world.bounds.width, game.cache.getImage('background').height, 'background');
  background.scale.x = (width/background.width);
  background.scale.y = (height/background.height);
  game.world.sendToBack(background);

	// centertext shizz
	centerText = game.add.text(game.world.centerX, game.world.centerY, "");

  // listen for keypresses
  cursors = game.input.keyboard.createCursorKeys();
	amanda.animations.add('left', [118, 119, 120, 121, 122, 123, 124, 125], 10, false);
	amanda.animations.add('right', [144, 145, 146, 147, 148, 149, 150, 151], 10, false);
	amanda.animations.add('hit', [208, 209, 210, 211, 212], 10, false);

	// angry villagers animations 'WE WILL GET YOU'
	victor.animations.add('shuffle', [118, 119, 120, 121, 122, 123, 124, 125], 10, true);
	victor.animations.play('shuffle');

	makeVillagers();

}

// runs the game
function update() {
	game.physics.arcade.collide(platforms, amanda);

	if(currentVillager) {
		currentVillager.destroy();
	}

	if(currentVillager2) {
		currentVillager2.destroy();
	}

	if(!started) {
		showInstructions();
	}

	if (lives > 0) {
		if (!cursors.down.isDown) {
			background.tilePosition.x -= 2;
		}
	}

	if (cursors.left.isDown) {
		amanda.animations.play('left');
		amanda.body.velocity.x = -325;
	} else if (cursors.right.isDown) {
		amanda.animations.play('right');
		amanda.body.velocity.x = 125;
	} else {
		amanda.body.velocity.x = 0;
		amanda.animations.play('right');
	}
	if (cursors.up.isDown) {
		if (amanda.body.touching.down) {
			amanda.body.velocity.y = -600;
		}
	}
	if (!amanda.body.touching.down) {
		game.physics.arcade.overlap(amanda, villagers, jumpOn, null, this);
	} else if (cursors.down.isDown) {
		amanda.frame = 259;
		game.physics.arcade.overlap(amanda, villagers, hit, null, this);
	} else {
		game.physics.arcade.overlap(amanda, villagers, minusOne, null, this);
	}
	pauseKey.onDown.add(pause, this);
	enterKey.onDown.add(unpause, this);
	spaceKey.onDown.add(jumpUp, this);
}

function makeVillagers() {
	if(lives > 0) {
		var num = Math.round(score/500) + 1;
		numVillagers(num);
	}
}

function numVillagers(num) {
	for(var i = 0; i < num; i++) {
		victor = villagers.create(game.world.width + (game.world.width * (Math.random())), (game.world.height - 200), 'victor');
		victor.animations.add('shuffle', [118, 119, 120, 121, 122, 123, 124, 125], 10, true);
		victor.animations.play('shuffle');
		victor.body.velocity.x = -200;
	}
}

function minusOne(amanda, villager) {
	rawr = game.add.sprite(0, 0, 'angry');
	rawr.scale.setTo(rawrX, rawrY);
	rawr.x = (amanda.left + ((amanda.width/1.9) - (rawr.width/1.5)));
	rawr.y = amanda.top - rawr.height;
	amanda.frame = 31;
	villager.frame = 172;
	game.paused = true;
	currentVillager = villager;
	lives -= 1;
	livesText.text = 'Patience: ' + lives;
	var awk = awkwardQuestions[Math.floor(Math.random() * awkwardQuestions.length)];
	writeCenter(awk);
	game.input.onDown.add(unpause, self);
	if(lives == 0) {
		amanda.x = (game.world.width / 2) - (amanda.width / 1.9); // GAME OVER
		rawr.scale.setTo(0.9,0.9);
		rawr.x = (game.world.width / 2) - (rawr.width / 1.5);
		rawr.y = (game.world.height / 2) - (rawr.width / 2);
		villagers.forEachAlive(killEmAll, this);
		writeCenter("GAME OVER\nRefresh to play again!")
	}
}

function jumpOn(amanda, villager) {
	currentVillager2 = villager;
	amanda.bottom = villager.top;
	amanda.left = villager.left;
	villager.frame = 265;
	game.paused = true;
	var snark = snarkyAnswers[Math.floor(Math.random() * snarkyAnswers.length)];
	writeCenter2(snark);
	score += 10;
	scoreText.text = 'Score: ' + score;
}

function jumpUp() {
	if (amanda.body.touching.down) {
		amanda.body.velocity.y = -600;
	}
}

function hit(amanda, villager) {
	villager.destroy();
	score += 2;
	scoreText.text = 'Score: ' + score;
}

function killEmAll(villager) {
	villager.kill();
}

function writeCenter(text) {
	centerText.destroy();
	centerText = game.add.text(game.world.centerX, 100, text);
	centerText.anchor.set(0.5);
	centerText.align = 'center';

	//	Font style
	centerText.font = 'Arial';
	centerText.fontSize = '3em';
	centerText.fill = '#8B5742';
}

function writeCenter2(text) {
	centerText.destroy();
	centerText = game.add.text(game.world.centerX, 100, text);
	centerText.anchor.set(0.5);
	centerText.align = 'center';

	//	Font style
	centerText.font = 'Arial';
	centerText.fontSize = '3em';
	centerText.fill = '#98A148';
}

function unpause(event) {
	game.paused = false;
	centerText.destroy();
	rawr.destroy();
	rawrX += 0.1;
	rawrY += 0.1;
}

function pause(event) {
	if(game.paused == false) {
		game.paused = true;
	} else {
		game.paused = false;
	}
}

// in case weirdos use Safari
function isSafari()
{
	var browser = navigator.appVersion;
	var device = navigator.platform;

	if(browser.indexOf("Safari") > -1 && device == "iPad")
	{
		return true;
	}
}
