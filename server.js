var express = require('express');
var app = express();

// Port for root server
var rootServerPort = 3000;
var rootServer = app.listen(rootServerPort);

app.use(express.static('public')); // as if we are saying that everything in the "public" folder will be client side

console.log("Global socket server is running on port " + rootServerPort);


var socket = require('socket.io');

var io = socket(rootServer);

io.sockets.on('connection', newConnection); // if there is message 'connection', from the client side (sketch.js), call newConnection func

function newConnection(socket){
    console.log('new connection: ' + socket.id);

    socket.on('joinSubServer', (subServerName) => {
        // Checking the existence of a room with the same name
        if (!io.sockets.adapter.rooms.has(subServerName)) {
            // Creating a new room if it doesn't exist
            socket.join(subServerName);
            console.log('Subserver "' + subServerName + '" is created.');
        } else {
            // Joining an existing room
            socket.join(subServerName);
        }
    });

    socket.on('mouse', mouseMsg); // if there is message 'mouse', from the client side (sketch.js), call mouseMsg func

    function mouseMsg(data){
        // this means that someone is currently drawing, so we need to send information to all other clients to update the dashboard.
        console.log(data);
        // Forward drawing data to all users in the room
        io.to(data.subServerName).emit('mouse', data);
        // socket.broadcast.emit('mouse', data);
        // io.sockets.emit('mouse', data)
    }
}