// foodz.js
const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');

// serving static files
app.use(express.static('public'));

// this line configures hbs our template engine
app.set('view engine', 'hbs');

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));


// LOGGING for TROUBLESHOOTING
app.use(function(req, res, next) {
	console.log(req.method + " " + req.path);
	console.log("=====");
	console.log(req.body);
	next();
});

var meals = [{name:'chocoramen', description:'ramen noodles in a chocolate almond milk broth',category: "breakfast"},{name:'chipotle', description:'rice, chicken, salsa, cheese and sour cream wrapped in a tortilla',category: "lunch"}, {name:'lycheezy', description:'cheese pizza with lychee on top',category: "anytime"},{name:'crazy cookie', description:"a 1 foot diameter cookie",category: "dinner"}];

app.get('/', function(req, res) {
	res.redirect('/foodz');
});

app.get('/foodz', function(req, res){
  var cat  = req.query.filterCategory;
  var filteredMeals = meals.filter(function(ele) {
    if(cat === ele.category) {
      return meals;
    }
  });
  if(cat === "" || filteredMeals.length===0) {
    filteredMeals = meals;
  }
  var str = "";
  if(req.query.filterCategory === 'breakfast') {
    str = "(breakfast Only)";
  } else if(req.query.filterCategory === 'lunch') {
    str = "(lunch Only)";
  } else if(req.query.filterCategory === 'dinner') {
    str = "(dinner Only)";
  } else if(req.query.filterCategory === 'anytime') {
    str = "(anytime Only)";
  }
  const context = {
    meals:filteredMeals,
    str:str
  };
  res.render('foodz', context);
});

app.post('/foodz', (req, res) => {
  const obj = {
    name: req.body.name,
    description: req.body.description,
    category:req.body.category
  };
  meals.push(obj);
  // res.render('postDemo', {foos: foos});
  res.redirect('/foodz');
});







app.listen(port);
console.log('Started server on port ' + port + ', CTRL + C to exit');
