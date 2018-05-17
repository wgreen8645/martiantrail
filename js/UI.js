var MarsH = MarsH || {};

MarsH.UI = {};

//show a notification in the message area
MarsH.UI.notify = function(message, type){
  document.getElementById('updates-area').innerHTML = '<div class="update-' + type + '">Day '+ Math.ceil(this.ship.day) + ': ' + message+'</div>' + document.getElementById('updates-area').innerHTML;
};

//refresh visual ship stats
MarsH.UI.refreshStats = function() {
  //modify the dom
  document.getElementById('stat-day').innerHTML = Math.ceil(this.ship.day);
  document.getElementById('stat-distance').innerHTML = Math.floor(this.ship.distance);
  document.getElementById('stat-crew').innerHTML = this.ship.crew;
  document.getElementById('stat-oxen').innerHTML = this.ship.oxen;
  document.getElementById('stat-food').innerHTML = Math.ceil(this.ship.food);
  document.getElementById('stat-money').innerHTML = this.ship.money;
  document.getElementById('stat-firepower').innerHTML = this.ship.firepower;
  document.getElementById('stat-weight').innerHTML = Math.ceil(this.ship.weight) + '/' + this.ship.capacity;

  //update ship position
  document.getElementById('caravan').style.left = (380 * this.ship.distance/MarsH.FINAL_DISTANCE) + 'px';
};

//show shop
MarsH.UI.showShop = function(products){

  //get shop area
  var shopDiv = document.getElementById('shop');
  shopDiv.classList.remove('hidden');

  //init the shop just once
  if(!this.shopInitiated) {

    //event delegation
    shopDiv.addEventListener('click', function(e){
      //what was clicked
      var target = e.target || e.src;

      //exit button
      if(target.tagName == 'BUTTON') {
        //resume journey
        shopDiv.classList.add('hidden');
        MarsH.UI.game.resumeJourney();
      }
      else if(target.tagName == 'DIV' && target.className.match(/product/)) {

        console.log('buying')

        var bought = MarsH.UI.buyProduct({
          item: target.getAttribute('data-item'),
          qty: target.getAttribute('data-qty'),
          price: target.getAttribute('data-price')
        });

        if(bought) target.html = '';
      }
    });

    this.shopInitiated = true;
  }

  //clear existing content
  var prodsDiv = document.getElementById('prods');
  prodsDiv.innerHTML = '';

  //show products
  var product;
  for(var i=0; i < products.length; i++) {
    product = products[i];
    prodsDiv.innerHTML += '<div class="product" data-qty="' + product.qty + '" data-item="' + product.item + '" data-price="' + product.price + '">' + product.qty + ' ' + product.item + ' - $' + product.price + '</div>';
  }

  //setup click event
  //document.getElementsByClassName('product').addEventListener(MarsH.UI.buyProduct);
};

//buy product
MarsH.UI.buyProduct = function(product) {
  //check we can afford it
  if(product.price > MarsH.UI.ship.money) {
    MarsH.UI.notify('Not enough money', 'negative');
    return false;
  }

  MarsH.UI.ship.money -= product.price;

  MarsH.UI.ship[product.item] += +product.qty;

  MarsH.UI.notify('Bought ' + product.qty + ' x ' + product.item, 'positive');

  //update weight
  MarsH.UI.ship.updateWeight();

  //update visuals
  MarsH.UI.refreshStats();

  return true;

};

//show attack
MarsH.UI.showAttack = function(firepower, gold) {
  var attackDiv = document.getElementById('attack');
  attackDiv.classList.remove('hidden');

  //keep properties
  this.firepower = firepower;
  this.gold = gold;

  //show firepower
  document.getElementById('attack-description').innerHTML = 'Firepower: ' + firepower;

  //init once
  if(!this.attackInitiated) {

    //fight
    document.getElementById('fight').addEventListener('click', this.fight.bind(this));

    //run away
    document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

    this.attackInitiated = true;
  }
};

//fight
MarsH.UI.fight = function(){

  var firepower = this.firepower;
  var gold = this.gold;

  var damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.ship.firepower));

  //check there are survivors
  if(damage < this.ship.crew) {
    this.ship.crew -= damage;
    this.ship.money += gold;
    this.notify(damage + ' people were killed fighting', 'negative');
    this.notify('Found $' + gold, 'gold');
  }
  else {
    this.ship.crew = 0;
    this.notify('Everybody died in the fight', 'negative');
  }

  //resume journey
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();
};

//running away
MarsH.UI.runaway = function(){

  var firepower = this.firepower;

  var damage = Math.ceil(Math.max(0, firepower * Math.random()/2));

  //check there are survivors
  if(damage < this.ship.crew) {
    this.ship.crew -= damage;
    this.notify(damage + ' people were killed running', 'negative');
  }
  else {
    this.ship.crew = 0;
    this.notify('Everybody died running away', 'negative');
  }

  //remove event listener
  document.getElementById('runaway').removeEventListener('click');

  //resume journey
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();

};