// dicey.js
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

var global_data = fs.readFileSync("diceware.wordlist.txt").toString();

var newData = '';
newData = global_data;
var diceList = {};
var line = newData.split('\n');
for(var i=0;i<line.length;i++) {
	var number = line[i].slice(0,5);
	var word = line[i].slice(6);
	diceList[number] = word;
}

var randomNums = [];
var totalRandom = [];
var finalWords = [];
var finalArray = [];
var finalString="";


app.get('/', function(req, res) {
	res.redirect('/dice');
});

app.get('/about', function(req, res){
	res.render('about');
});

app.get('/dice', function(req, res){
	console.log(req.query);
	if (req.query.numWords !== undefined) {
		var wd = req.query.numWords;
		var gl = req.query.glue;
		simulator(wd, gl);
	}
	var generated = "Generated Passphrase:";
	var context = {
		generated : generated,
		finalString : finalString,
		totalRandom, totalRandom,
		finalWords : finalWords
	}
	res.render('dice', context);
	randomNums = [];
	totalRandom = [];
	finalWords = [];
	finalArray = [];
	finalString="";
});


app.post('/dice', function(req, res) {
	numWords = req.body.numWords;
	glue = req.body.glue;
	simulator(numWords, glue);
	res.redirect('/dice');
});

function simulator(numWords, glue) {
	var newNum = parseInt(numWords);
	for(var j=0;j<newNum;j++) {
		for(var i=0;i<5;i++) {
			randomNums.push(Math.floor((Math.random() * 6) + 1));
		}
		totalRandom.push(randomNums.join(" "));
		var combineNum = randomNums.join("");
		randomNums = [];
		if(diceList[combineNum] !== undefined) {
			var value = diceList[combineNum];
			finalWords.push(value);
		}
	}
	var styleProp='';
	if(glue ==='comma') {
		styleProp=',';
	} else if(glue ==='star') {
		styleProp='*';
	} else if(glue ==='space') {
		styleProp=' ';
	} else if(glue ==='dash') {
		styleProp='-';
	} if(glue ==='none') {
		styleProp='';
	}
	for(var k=0;k<finalWords.length;k++) {
		finalArray.push(finalWords[k]);
		finalArray.push(styleProp);
	}
	finalArray = finalArray.slice(0,finalArray.length-1);
	finalString = finalArray.join("");
}


app.listen(port);
console.log('Started server on port ' + port + ', CTRL + C to exit');
