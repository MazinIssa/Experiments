var http = require('http');
var port = 8080;
var ip = '192.168.254.16';
http.createServer(function (req, res) {
  console.log(req);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port, ip);
console.log('Server running at http://' + ip + ':' + port + '/');