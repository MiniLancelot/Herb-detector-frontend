var socket = io.connect('http://localhost:5000');
socket.on('connect', function() {
    socket.emit('test event', {data: 'I\'m connected!'});
});
socket.on('my response', function(msg) {
    console.log(msg);
});