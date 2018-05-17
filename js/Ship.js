var MarsH = MarsH || {};

MarsH.Ship = {};

MarsH.Ship.init = function(stats){
  this.day = stats.day;
  this.distance = stats.distance;
  this.crew = stats.crew;
  this.food = stats.food;
  this.oxen = stats.oxen;
  this.money = stats.money;
  this.firepower = stats.firepower;
};

//update weight and capacity
MarsH.Ship.updateWeight = function(){
  var droppedFood = 0;
  var droppedGuns = 0;

  //how much can the caravan carry
  this.capacity = this.oxen * MarsH.WEIGHT_PER_FUEL + this.crew * MarsH.WEIGHT_PER_PERSON;

  //how much weight do we currently have
  this.weight = this.food * MarsH.FOOD_WEIGHT + this.firepower * MarsH.FIREPOWER_WEIGHT;

  //drop things behind if it's too much weight
  //assume guns get dropped before food
  while(this.firepower && this.capacity <= this.weight) {
    this.firepower--;
    this.weight -= MarsH.FIREPOWER_WEIGHT;
    droppedGuns++;
  }

  if(droppedGuns) {
    this.ui.notify('Left '+droppedGuns+' guns behind', 'negative');
  }

  while(this.food && this.capacity <= this.weight) {
    this.food--;
    this.weight -= MarsH.FOOD_WEIGHT;
    droppedFood++;
  }

  if(droppedFood) {
    this.ui.notify('Left '+droppedFood+' food provisions behind', 'negative');
  }
};

//update covered distance
MarsH.Ship.updateDistance = function() {
  //the closer to capacity, the slower
  var diff = this.capacity - this.weight;
  var speed = MarsH.SLOW_SPEED + diff/this.capacity * MarsH.FULL_SPEED;
  this.distance += speed;
};

//food consumption
MarsH.Ship.consumeFood = function() {
  this.food -= this.crew * MarsH.FOOD_PER_PERSON;

  if(this.food < 0) {
    this.food = 0;
  }
};
