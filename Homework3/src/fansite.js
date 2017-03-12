// fansite.js
// create your own fansite using your miniWeb framework


var App = require('./miniWeb.js').App;
var app = new App();

app.get('/', function (req, res) {
    res.sendFile('/html/homeGandalf.html');
});
app.get('/home', function (req, res) {
    res.redirect(301,'/');
    res.end();
});
app.get('/home/', function (req, res) {
    res.redirect(301,'/');
    res.end();
});

app.get('/css/style.css', function (req, res) {
    res.sendFile('/css/style.css');
});

app.get('/img/gandalf.png', function (req, res) {
   res.sendFile('/img/gandalf.png');
});

app.get('/about',function (req, res) {
   res.sendFile('/html/about.html');
});
app.get('/about/', function (req, res) {
    res.redirect(301,'/about');
    res.end();
});

app.get('/rando', function (req, res) {
    res.sendFile('/html/random.html');
});
app.get('/rando/', function (req, res) {
    res.redirect(301, '/random');
    res.end();

});
app.get('/randomPic', function (req, res) {

    var random = Math.floor(Math.random()*4 +1);
    if(random === 0){
        res.sendFile('/img/gandalf1.gif');
    }
    if(random === 1){
        res.sendFile('/img/gandalf2.gif');
    }
    if(random === 2){
        res.sendFile('/img/gandalf3.gif');
    }
    if(random === 3){
        res.sendFile('/img/gandalf4.jpg');
    }
    if(random === 4){
        res.sendFile('/img/gandalf5.gif');
    }
});


app.listen(8080, '127.0.0.1');
