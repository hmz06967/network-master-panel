const http = require("http");

const host = 'localhost';
const port = 80;

const requestListener = function (req, res) {};

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'aplication/json'});
  res.to('Hello World!');
  res.end();
}).listen(port); 