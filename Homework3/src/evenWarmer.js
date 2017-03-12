// evenWarmer.js
// create Request and Response constructors...

const net = require('net');
const fs = require('fs');
const PORT = 8080;
const HOST = '127.0.0.1';

const server = net.createServer(function(sock) {
    sock.on('data', function(data) {
      var dataString = '';
      dataString = dataString + data;
      var req = new Request(dataString);
      console.log(req.toString(sock));
      var path = req.path;
      var res = new Response(sock);
          //res.sendFile('/css/base.css');

    		// if(path === '/'){
    		// 	sock.write('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n <link rel = "stylesheet" type = "text/css" href = "/foo.css">');
    		// 	sock.write(' <h2> This is a red header! </h2>\r\n\r\n <em> Hello </em> <strong> World </strong> ');
    		// 	sock.end();
    		// } else if(path === '/foo.css'){
    		// 	sock.write('HTTP/1.1 200 OK\r\nContent-Type: text/css\r\n\r\n h2 {color: red;} ');
    		// 	sock.end();
    		// } else{
    		// 	sock.write('HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\n page not found  ');
    		// 	sock.end();
    		// }


        sock.end();
    });

});
server.listen(PORT);
console.log('started server on port', PORT, '...press ctrl + c to close!');


module.exports = {
	Request: Request,
	Response: Response
}

function Request(s) {
  var parts = s.split('\r\n');
  var line = parts[0].split(' ');
  var method = line[0];
  var path = line[1];
  this.method = method;
  this.path = path;

  var host = parts[1].split(' ');
  var referer = parts[2].split(' ');
  var body = parts[3];

  if (host[1] && referer[1]) {
    this.headers = {
      Host: host[1],
      Referer: referer[1]
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
  this.body = '\r\n';
  this.headers = {};
  this.sock = sock;

  var codeObj = {
    '200' : 'OK',
    '404' : 'Not Found',
    '500' : 'Internal Server Error',
    '400' : 'Bad Request',
    '301' : 'Moved Permanently',
    '302' : 'Found',
    '303' : 'See Other'
  };
  this.setHeader = function(name, value) {
    this.headers[name] = value;
  };
  this.write = function(data) {
    sock.write(data);
  };

  this.end = function(s) {
    sock.write(s);
    sock.end();
  };

  this.send = function(statusCode, body) {
    this.statusCode = statusCode;
  	this.body = body;
  	this.write(this.toString());
  	this.end();
  };

  this.writeHead = function(statusCode) {
    this.statusCode = statusCode;
    this.write();
  };

  this.redirect = function(statusCode, url) {
    if(isNaN(statusCode)){
      this.statusCode = 301;
      this.headers.Location = arguments[0];
    }
    else{
      this.statusCode = statusCode;
      this.headers.Location = url;
    }
    this.end(this.statusCode, this.headers.Location);
  };


  this.toString = function() {
    var str = '';
    var space = '\r\n';
    str += str + 'HTTP/1.1 ';
    if(Object.keys(this.headers).length === 0){
      str += this.statusCode + ' ' + codeObj[this.statusCode] + space + this.body;
    }
    else{
      var headerString = '';
      for(var i in this.headers) {
        headerString = headerString + i + ': ' + this.headers[i] + space;
      }
      if(this.body == space){
        this.body = '';
      }
      str += this.statusCode + ' ' + codeObj[this.statusCode] + space + headerString + space + this.body;
    }
    return str;
  };

  this.sendFile = function(fileName) {
    const publicRoot = __dirname + '/../public';
    const filePath =  publicRoot + fileName;
    var split = fileName.split('.');
	  var extension = split[1];
	  var textContent = false;
    if(extension === 'jpeg' || extension === 'jpg') {
      textContent = false;
      this.headers['Content-type'] = 'images/jpeg';
    } else if (extension === 'png') {
      textContent = false;
      this.headers['Content-type'] = 'images/png';
    } else if (extension === 'gif') {
      textContent = false;
      this.headers['Content-type'] = 'images/gif';
    } else if (extension === 'html') {
      textContent = true;
      this.headers['Content-type'] = 'text/html';
    } else if (extension === 'css') {
      textContent = true;
      this.headers['Content-type'] = 'text/css';
    } else if (extension === 'txt') {
      textContent = true;
      this.headers['Content-type'] = 'text/plain';
    }

    if(textContent === true) {
  		fs.readFile(filePath, {"encoding": "utf8"}, this.handleRead.bind(this, this.headers['Content-Type']));
    } else {
      fs.readFile(filePath, {}, this.handleRead.bind(this, this.headers['Content-Type']));
    }

  };

  this.handleRead = function(contentType, err, data) {
    if(err){
  		this.setHeader('Content-Type', contentType);
  		this.send(500, 'An error has occured!');
  	} else {
  		this.setHeader('Content-Type', contentType);
  		this.writeHead(200);
  		this.write(data);
  		this.end();
  	}
  }

}
