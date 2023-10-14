var express = require('express');
var app = express();

// Port for root server
var rootServerPort = 3000;
var rootServer = app.listen(rootServerPort);

app.use(express.static('public')); // as if we are saying that everything in the "public" folder will be client side

console.log("Global socket server is running on port " + rootServerPort);



var canvasData = {}; // Объект для хранения состояния конваса

var socket = require('socket.io');

var io = socket(rootServer);

io.sockets.on('connection', newConnection); // if there is message 'connection', from the client side (sketch.js), call newConnection func

function newConnection(socket){
    console.log('new connection: ' + socket.id);

    socket.on('joinSubServer', (subServerName) => {
        // Получаем список комнат, к которым присоединен сокет
        const rooms = socket.adapter.sids.get(socket.id);
        console.log(rooms);

        // Удаляем сокет из всех комнат, к которым он был присоединен
        rooms.forEach((room) => {
            if (room !== socket.id){
                socket.leave(room);
                console.log(room);

            }
        });
        // Joining the room
        socket.join(subServerName);
        console.log('Joining an "' + subServerName + '" room.');
        // Sending convas status to a new user
        if (canvasData[subServerName]) {
            socket.emit('syncCanvas', canvasData[subServerName]);
        }
        else{
            socket.emit('syncCanvas', []);
        }
    });

    socket.on('mouse', mouseMsg); // if there is message 'mouse', from the client side (sketch.js), call mouseMsg func

    function mouseMsg(data){
        // this means that someone is currently drawing, so we need to send information to all other clients to update the dashboard.
        console.log('Receive and send: ' + data.x + ' ' + data.y + ' ' + data.subServerName);

        // Saving a drawing action to the server
        const { x, y, subServerName } = data;
        if (!canvasData[subServerName]) {
            canvasData[subServerName] = [];
        }
        canvasData[subServerName].push({ x, y });

        // Forward drawing data to all users in the room
        socket.to(subServerName).emit('mouse', data);
        // io.to(data.subServerName).emit('mouse', data);


        // socket.broadcast.emit('mouse', data);
        // io.sockets.emit('mouse', data)
    }

    socket.on('clearCanvas', (subServerName)=>{
        canvasData[subServerName] = [];
        io.to(subServerName).emit('clearCanvas');
    });
}