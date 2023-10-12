var socket;

function setup(){
    createCanvas(600, 400);
    background(51);

    socket = io.connect('http://localhost:3000'); //join the server, and at the same time send a message "connection"
    socket.on('mouse', newDrawing); // if there is message 'mouse', from the server side (server.js), call newDrawing func 

}

function newDrawing(data){
    // this means that someone is currently drawing, so we need to update the dashboard
    noStroke();
    fill(255);
    ellipse(data.x, data.y, 36, 36);

}

function mouseDragged(){
    var data = {
        x: mouseX,
        y: mouseY
    }
    socket.emit('mouse', data); // every time you draw something, a message is sent to the server with the keyword "mouse" and the data "data".
    console.log('Sending: ' + data);

    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 36, 36);
}

function draw(){
}