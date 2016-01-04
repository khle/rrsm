var path = require('path'),
    express = require('express'),
    Rx = require('rx');

var app = express();
app.use('/', express.static(path.join(__dirname, 'client')));

var server = app.listen(8080);
console.log('Server listening on port 8080');

var io = require('socket.io')(server);
var source = Rx.Observable.create(function(observer) {
        
    io.on('connection', function(socket) {
        console.log('connection');
        socket.on('client connect', function(data) {       
            console.log('client connect ', data);
            observer.onNext({'socket': socket, 'data': data});       
        });           
    });    
    
    return function() {
        io.close();
    }
});

var observer = source.subscribe(function(obj) {    
    //obj.socket.emit('new user', obj.data);
    io.emit('new user', obj.data);    
    console.log('New client connected ', obj.data);
});

