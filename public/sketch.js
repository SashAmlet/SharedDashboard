var socket;
const globalServerPort = 3000;
var subServerName = '';

function setup(){
    createCanvas(600, 400);
    background(51);

    socket = io.connect('http://localhost:3000'); //join the server, and at the same time send a message "connection"

    // Adding an input (connection) field
    var input = createInput();
    input.position(10, height + 10);
    var connectButton = createButton('Connect');
    connectButton.position(input.x + input.width, height + 10);

    connectButton.mousePressed(function() {
        subServerName = input.value();
        // Joining the selected subserver (room)
        socket.emit('joinSubServer', subServerName);
    });

    // Adding an clear button
    var clearButton = createButton('Clear');
    clearButton.position(connectButton.x + connectButton.width, height + 10);

    clearButton.mousePressed(function() {
        clearCanvas();
        socket.emit('clearCanvas', subServerName);
    });
    

    // socket actions

    socket.on('mouse', newDrawing); // if there is message 'mouse', from the server side (server.js), call newDrawing func 

    socket.on('syncCanvas', function(data) {
        // Convas update based on received data
        redrawCanvas(data);
    });

    socket.on('clearCanvas', ()=>{
        clearCanvas();
    });

}

function clearCanvas(){
    background(51);
}

function newDrawing(data){
    console.log('Receive: ' + data.x + ' ' + data.y + ' ' + data.subServerName);
    // this means that someone is currently drawing, so we need to update the dashboard
    noStroke();
    fill(255);
    ellipse(data.x, data.y, 20, 20);
}

function mouseDragged(){
    var data = {
        x: mouseX,
        y: mouseY,
        subServerName: subServerName
    }
    socket.emit('mouse', data); // every time you draw something, a message is sent to the server with the keyword "mouse" and the data "data".
    console.log('Sending: ' + data.x + ' ' + data.y + ' ' + data.subServerName);

    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 20, 20);
}

function redrawCanvas(canvasData) {
    background(51);

    // Redrawing a convas based on data from an array
    for (var i = 0; i < canvasData.length; i++) {
        var data = canvasData[i];
        fill(255);
        noStroke();
        ellipse(data.x, data.y, 20, 20);
    }
}