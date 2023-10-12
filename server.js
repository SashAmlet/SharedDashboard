var express = require('express');

var app = express();
var server = app.listen(3000); // port: 3000

app.use(express.static('public')); // as if we are saying that everything in the "public" folder will be client side

console.log("My socket server is running");




var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection); // if there is message 'connection', from the client side (sketch.js), call newConnection func

function newConnection(socket){
    console.log('new connection: ' + socket.id);

    socket.on('mouse', mouseMsg); // if there is message 'mouse', from the client side (sketch.js), call mouseMsg func

    function mouseMsg(data){
        // this means that someone is currently drawing, so we need to send information to all other clients to update the dashboard.
        console.log(data);
        socket.broadcast.emit('mouse', data);
        // io.sockets.emit('mouse', data)
    }
}