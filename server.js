var path = require('path'),
    express = require('express');

// Server part
var app = express();
app.use('/', express.static(path.join(__dirname, 'client')));

var server = app.listen(8080);
console.log('Server listening on port 8080');

var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('New client connected ');
    
});