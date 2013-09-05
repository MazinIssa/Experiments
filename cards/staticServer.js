var static = require('node-static');
var file = new static.Server('./public');

require('http').createServer(function (request, response) {
        file.serve(request, response);
}).listen(8080);