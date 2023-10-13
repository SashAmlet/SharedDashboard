var socket;
const globalServerPort = 3000;
var inputString = '';

function setup(){
    createCanvas(600, 400);
    background(51);


    // Adding an input field
    var input = createInput();
    input.position(10, height + 10);
    var button = createButton('Connect');
    button.position(input.x + input.width, height + 10);

    socket = io.connect('http://localhost:3000'); //join the server, and at the same time send a message "connection"

    button.mousePressed(function() {
        var subServerName = input.value();
        inputString = subServerName;
        // Joining the selected subserver (room)
        socket.emit('joinSubServer', subServerName);
    });

    socket.on('mouse', newDrawing); // if there is message 'mouse', from the server side (server.js), call newDrawing func 

}

function newDrawing(data){
    // this means that someone is currently drawing, so we need to update the dashboard
    noStroke();
    fill(255);
    ellipse(data.x, data.y, 20, 20);

}

function mouseDragged(){
    var data = {
        x: mouseX,
        y: mouseY,
        subServerName: inputString
    }
    socket.emit('mouse', data); // every time you draw something, a message is sent to the server with the keyword "mouse" and the data "data".
    console.log('Sending: ' + data);

    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 20, 20);
}

function draw(){
}