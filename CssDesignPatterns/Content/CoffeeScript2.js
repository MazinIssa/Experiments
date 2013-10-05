(function() {
  var Animal, animal, y,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  y = {
    name: "mazen",
    age: 5,
    intelligence: 0
  };

  console.log("Hello, he has intelligence of " + y.intelligence + ".");

  Animal = (function() {
    Animal.prototype.price = 5;

    function Animal(name) {
      this.name = name;
      this.sell = __bind(this.sell, this);
    }

    Animal.prototype.sell = function() {
      return console("give me " + this.price + " KD");
    };

    return Animal;

  })();

  animal = new Animal("Parrot");

  console.log("The animal is a " + animal.name);

}).call(this);
