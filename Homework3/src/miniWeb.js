// // miniWeb.js
// // define your Request, Response and App objects here

module.exports = {
  Request : Request,
  Response : Response,
  App : App
}

var net = require('net');
var fs = require('fs');

function Request(s) {
  var parts = s.split('\r\n');
  var line = parts[0].split(' ');
  var method = line[0];
  var path = line[1];
  this.method = method;
  this.path = path;

  var host = parts[1].split(' ');
  var sender = parts[2].split(' ');
  var body = parts[3];

  if (host[1] && sender[1]) {
      this.headers = {
          Host: host[1],
          Sender: sender[1]
      }
  }
  else {
      this.headers = {
          Host: host[1]
      }
  }
  this.body = body;
  this.toString = function () {
      return s;
  };
}


function Response(sock) {
    this.statusCode = 0;
    this.body = '';
    this.sock = sock;
    this.headers = {};
    var codeObj = {
        '200' : 'OK',
        '404' : 'Not Found',
        '500' : 'Internal Server Error',
        '400' : 'Bad Request',
        '301' : 'Moved Permanently',
        '302' : 'Found',
        '303' : 'See Other'
    };
}

Response.prototype.setHeader  = function(name, value){
  this.headers[name] = value;
};
Response.prototype.write = function(data){
  this.sock.write(data);
};

Response.prototype.end = function(s){
  if(s != undefined)
    this.sock.write(s);
    this.sock.end();
};

Response.prototype.send = function (statusCode, body) {
  var s = 'HTTP/1.1';
  this.statusCode = statusCode;
  this.body = body;
  this.end(this.toString());
};

Response.prototype.writeHead = function (statusCode) {
  this.statusCode = statusCode;
};

Response.prototype.redirect = function(statusCode, url){
  if(isNaN(statusCode)){
    this.statusCode = 301;
    this.setHeader("Location", statusCode);
  }
  else{
    this.statusCode = statusCode;
    this.setHeader("Location", url);
  }
  this.send(this.statusCode, this.body);
};

Response.prototype.sendFile = function(fileName) {
  var fs  = require('fs');
  var path = require('path');
  this.handleThis = function(contentType,err, data){
    console.log(err);
    if(err){
      this.writeHead(500);
      this.end();
    }
    else{
      this.writeHead(200);
      this.setHeader('Content-Type', contentType);
      this.write(data);
      this.end();
    }
  };
  var dir = path.resolve('..')+'/public'+fileName;
  this.dir = dir;
  var ext = {
    'jpeg' : 'image/jpeg',
    'jpg': 'image/jpeg',
    'png' : 'image/png',
    'gif' : 'image/gif',
    'html' : 'text/html',
    'css' : 'text/css',
    'txt' : 'text/plain'
  };
  var extension = fileName.split('.');
  extension = extension[extension.length - 1];
  this.contentType = ext[extension];

  if(extension === 'html' || extension === 'css' || extension === 'txt'){
    fs.readFile(this.dir,{encoding : 'utf8'},this.handleThis.bind(this,this.contentType));
  }
  else {
    fs.readFile(this.dir,{},this.handleThis.bind(this,this.contentType));
  }
};


Response.prototype.toString = function(){
  var str  = 'HTTP/1.1';
  if(Object.keys(this.headers).length === 0){
    str = str + ' '+this.statusCode+' '+codeObj[this.statusCode]+'\r\n\r\n'+this.body;
  }
  else{
    var headerString = '';
    for(var v in this.headers){
      headerString = headerString + v+': '+this.headers[v]+'\r\n';
    }
    str = str + ' '+this.statusCode+' '+codeObj[this.statusCode]+'\r\n'+headerString+'\r\n'+this.body;
  }
  return str;
};


function App() {
	this.server = net.createServer(this.handleConnection.bind(this));
	this.routes = {};
}

App.prototype.get = function (path, callback) {
  this.routes[path]  = callback;
};

App.prototype.listen  = function (port, host) {
  this.server.listen(port, host);
};

App.prototype.handleConnection  = function (sock) {
  sock.on('data', this.handleRequestData.bind(this,sock));
};

App.prototype.handleRequestData = function (sock, binaryData) {
  this.data  = binaryData+"";
  var stringData  = this.data.split(' ');
  this.req = new Request(this.data);
  this.res = new Response(sock);
  if(stringData[0]!='HTTP/1.1'){
      this.res.statusCode = 400;
  }
  if(this.routes[this.req.path] !=undefined){
      this.routes[this.req.path](this.req, this.res);
  }
  else{
      this.res.statusCode = 404;
      this.res.send(404, "No page found");
  }
  sock.on('close', this.logResponse.bind(this, this.req, this.res));
};


App.prototype.logResponse = function(req, res){
  var codeObj = {
      '200' : 'OK',
      '404' : 'Not Found',
      '500' : 'Internal Server Error',
      '400' : 'Bad Request',
      '301' : 'Moved Permanently',
      '302' : 'Found',
      '303' : 'See Other'
  };
  var shortMessage  = codeObj[res.statusCode];
  console.log(req.method + ' '+req.path+' - '+res.statusCode+' '+shortMessage);
};
