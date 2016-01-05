var path = require('path'),
    express = require('express'),
    Rx = require('rx');

var app = express();
app.use('/', express.static(path.join(__dirname, 'client')));

var server = app.listen(8080);
console.log('Server listening on port 8080');

var io = require('socket.io')(server);
var source = Rx.Observable.create(function(observer) {
    
    //start
    io.on('connection', function(socket) {
        console.log('Client connection notified to server first. Client socketId is ', socket.id);
        
        socket.emit('my socketId', {'socketId': socket.id, 'connectTime': Date.now()});
        
        socket.on('client connect', function(data) {
            observer.onNext({'socket': socket, 'data': data, 'event': 'client connect'});       
        });           
    });    
    
    return function() {
        io.close();
    }
});

var observer = source
.filter(function(data) {
    return data.event === 'client connect';
})
.subscribe(function(obj) {    
    //obj.socket.emit('new user', obj.data);
    io.emit('new user', obj.data);    
    console.log('New client connected ', obj.data);
});

