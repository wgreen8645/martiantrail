var MarsH = MarsH || {};

//constants
MarsH.WEIGHT_PER_SHIP = 20;
MarsH.WEIGHT_PER_PERSON = 2;
MarsH.FOOD_WEIGHT = 0.6;
MarsH.FIREPOWER_WEIGHT = 5;
MarsH.GAME_SPEED = 800;
MarsH.DAY_PER_STEP = 0.2;
MarsH.FOOD_PER_PERSON = 0.02;
MarsH.FULL_SPEED = 5;
MarsH.SLOW_SPEED = 3;
MarsH.FINAL_DISTANCE = 1000;
MarsH.EVENT_PROBABILITY = 0.15;
MarsH.ENEMY_FIREPOWER_AVG = 2;
MarsH.ENEMY_GOLD_AVG = 50;

MarsH.Game = {};

//initiate the game
MarsH.Game.init = function(){

  //reference ui
  this.ui = MarsH.UI;

  //reference event manager
  this.eventManager = MarsH.Event;

  //setup caravan
  this.ship = MarsH.Ship;
  this.ship.init({
    day: 0,
    distance: 0,
    crew: 5,
    food: 10,
    oxen: 2,
    money: 150,
    firepower: 3
  });

  //pass references
  this.ship.ui = this.ui;
  this.ship.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.ship = this.ship;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.ship = this.ship;
  this.eventManager.ui = this.ui;

  //begin adventure!
  this.startJourney();
};

//start game and begin tracking time
MarsH.Game.startJourney = function() {
  this.gameActive = true;
  this.previousTime = null;
  this.ui.notify('On a winter day, a rocket blasts off from Ohio. Your journey begins.', 'positive');

  this.step();
};

//loop it
MarsH.Game.step = function(timestamp) {

  //starting, setup the previous time for the first time
  if(!this.previousTime){
    this.previousTime = timestamp;
    this.updateGame();
  }

  //time difference
  var progress = timestamp - this.previousTime;

  //game update
  if(progress >= MarsH.GAME_SPEED) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  
  if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
};

//update game stats
MarsH.Game.updateGame = function() {
  //day update
  this.ship.day += MarsH.DAY_PER_STEP;

  //food consumption
  this.ship.consumeFood();

  if(this.ship.food === 0) {
    this.ui.notify('Your ship starved to death', 'negative');
    this.gameActive = false;
    return;
  }

  //update weight
  this.ship.updateWeight();

  //update progress
  this.ship.updateDistance();

  //show stats
  this.ui.refreshStats();

  //check if everyone died
  if(this.ship.crew <= 0) {
    this.ship.crew = 0;
    this.ui.notify('Everyone died', 'negative');
    this.gameActive = false;
    return;
  }

  //check if win
  if(this.ship.distance >= MarsH.FINAL_DISTANCE) {
    this.ui.notify('You have made it to Mars!', 'positive');
    this.gameActive = false;
    return;
  }

  //random events
  if(Math.random() <= MarsH.EVENT_PROBABILITY) {
    this.eventManager.generateEvent();
  }
};

//pause the journey
MarsH.Game.pauseJourney = function() {
  this.gameActive = false;
};

//resume the journey
MarsH.Game.resumeJourney = function() {
  this.gameActive = true;
  this.step();
};


//init game
MarsH.Game.init();