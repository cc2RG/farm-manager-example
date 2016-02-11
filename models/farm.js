var mongoose = require('mongoose');
var Animal = require('./animal');

var farmSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: false},
  farmer: String,
  contact: {
    website: String,
    address: String,
    country: String,
  },
  animals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Animal"}]
});

farmSchema.methods.addAnimal = function(animal){
  this.animals.push(animal);
}

farmSchema.methods.removeAnimal = function(animalToRemove){
  this.animals = this.animals.filter(function(animal){
    return animal !== animalToRemove._id;
  });
};


var Farm = mongoose.model('Farm', farmSchema);




module.exports = Farm; 