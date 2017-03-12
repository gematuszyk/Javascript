// warmUp.js
const net = require('net');
const PORT = 8080;
const HOST = '127.0.0.1';

const server = net.createServer((sock) => {
    console.log('client connected:', sock.remoteAddress, sock.remotePort);
    sock.on('data', (b) => {
        console.log('got data!', b + '');
        sock.write('HTTP/1.1 200 OK\nContent-Type: text/html\n\n<em>Hello</em> <strong>World</strong>');
        sock.end();
    });

});
server.listen(PORT);
console.log('started server on port', PORT, '...press ctrl + c to close!');
