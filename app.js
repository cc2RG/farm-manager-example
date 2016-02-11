var express        = require('express');
var path           = require('path');
var bodyParser     = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var app            = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/farm-manager');

var Animal = require('./models/animal');
var Farm = require('./models/farm');

//App settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressLayouts);

//Serve js & css files from a public folder
app.use(express.static(__dirname + '/public'));

//Locals Methods
Farm.find(function(err, farms){
  if(err) console.log(err)
  app.locals.farms = farms; 
})

// ############ YOU CAN ADD YOUR ROUTES BELOW HERE
//Index
app.get("/", function(req,res){
  Animal.find(function(err, animals){
    if(err) console.log(err)
    res.render('index',{animals: animals}); 
  })
});

//Create
app.post("/", function(req, res){
   var newAnimal = new Animal(req.body);
   newAnimal.vetReport = {health: req.body.health, outlook: req.body.outlook};

   newAnimal.save(function(err, animal){
     if(err) console.log(err);
     console.log("New animal created");

     //Add it to the selected farm
     Farm.findById(req.body.farm_id, function(err, farm){
        if(err) console.log(err);
        farm.addAnimal(animal);
        farm.save(function(err){
          if(err) console.log(err);
          res.redirect("/");
        })       
     })
   })
})

//Show
app.get("/:id", function(req, res){
  

  Animal.findById(req.params.id, function(err, animal){
    if(err) console.log(err);
    res.render('show', { animal: animal })    
  })
})

//Edit
app.get("/:id/edit", function(req, res){
  
  Animal.findById(req.params.id, function(err, animal){
    if(err) console.log(err);
    res.render('edit', { animal: animal })    
  })
})

//Update
app.post("/:id", function(req, res){
  req.body.vetReport = {health: req.body.health, outlook:req.body.outlook};
  Animal.findByIdAndUpdate(req.body._id, req.body, function(err, animal){
    if(err) console.log(err);
    res.redirect('/');
  })

})
//Delete
app.post("/:id/delete",function(req, res){
  //req.body.vetReport = {health: req.body.health, outlook:req.body.outlook};
  Animal.findByIdAndRemove(req.params.id, function(err, animal){
  if(err) console.log(err);
  res.redirect('/') 
  });
})

app.listen(3000, function(){
  console.log("Welcome to the Farm Manager");
});