var MarsH = MarsH || {};

MarsH.Event = {};

MarsH.Event.eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -3,
    text: 'Some weird alien stuff has poisoned your food. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -4,
    text: 'You met with some martians the other day, it seems they have spread a disease to you and your crew. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Some sort of alien bug has infested your food. Food lost: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -50,
    text: 'A sneaky martian stole some of your money. Money lost: $'
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'oxen',
    value: -1,
    text: 'You catch a martian stealing some of your fuel, but it gets away before you can do anything. Fuel lost: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'You finally meet a semi-decent martian species who trades some food with you, you\'re a little hesitant but it seems fine. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'You found some food on a weird planet, Mmmmm tastes like martian. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'oxen',
    value: 1,
    text: 'You steal some fuel from a martian species, who knows what they\'ll do to you but it\'s worth the risk I guess... Fuel added: '
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'food', qty: 20, price: 50},
      {item: 'fuel', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 50},
      {item: 'crew', qty: 5, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'food', qty: 30, price: 50},
      {item: 'fuel', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 20},
      {item: 'crew', qty: 10, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: '"Friendly" Martians have things to sell you',
    products: [
      {item: 'food', qty: 20, price: 60},
      {item: 'fuel', qty: 1, price: 300},
      {item: 'firepower', qty: 2, price: 80},
      {item: 'crew', qty: 5, price: 60}
    ]
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'You and your crew have been attacked by a gang of martians!'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Martians living on what seems like Earth have fooled you into thinking they\'re your family, and have attacked you when you were the most vulnerable!'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'These martians are too happy about you trying to colonize their planet...'
  }
];

MarsH.Event.generateEvent = function(){
  //pick random one
  var eventIndex = Math.floor(Math.random() * this.eventTypes.length);
  var eventData = this.eventTypes[eventIndex];

  //events that consist in updating a stat
  if(eventData.type == 'STAT-CHANGE') {
    this.stateChangeEvent(eventData);
  }

  //shops
  else if(eventData.type == 'SHOP') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.shopEvent(eventData);
  }

  //attacks
  else if(eventData.type == 'ATTACK') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.attackEvent(eventData);
  }
};

MarsH.Event.stateChangeEvent = function(eventData) {
  //can't have negative quantities
  if(eventData.value + this.ship[eventData.stat] >= 0) {
    this.ship[eventData.stat] += eventData.value;
    this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
  }
};

MarsH.Event.shopEvent = function(eventData) {
  //number of products for sale
  var numProds = Math.ceil(Math.random() * 4);

  //product list
  var products = [];
  var j, priceFactor;

  for(var i = 0; i < numProds; i++) {
    //random product
    j = Math.floor(Math.random() * eventData.products.length);

    //multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();

    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      price: Math.round(eventData.products[j].price * priceFactor)
    });
  }

  this.ui.showShop(products);
};

//prepare an attack event
MarsH.Event.attackEvent = function(eventData){
  var firepower = Math.round((0.7 + 0.6 * Math.random()) * MarsH.ENEMY_FIREPOWER_AVG);
  var gold = Math.round((0.7 + 0.6 * Math.random()) * MarsH.ENEMY_GOLD_AVG);

  this.ui.showAttack(firepower, gold);
};