y =
    name: "mazen"
    age: 5
    intelligence: 0

console.log "Hello, he has intelligence of #{y.intelligence}."

class Animal
    price: 5
    constructor: (@name) ->
    sell: => console "give me #{@price} KD"

animal = new Animal("Parrot");
console.log "The animal is a #{animal.name}"