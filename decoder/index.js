var http = require('http'),
  socket = require('socket.io'),
  fs = require('fs'),
  child = require("child_process"),
  five = require("johnny-five"),
  app, board, io, sensor


// main route
// TODO: express?
function handler (req, res) {
  //fs.readFile(__dirname + '/views/index.html',
  fs.readFile(__dirname + req.url, function (err,data) {
    if (err) {
      res.writeHead(404)
      res.end(JSON.stringify(err))
      return;
    }
    res.writeHead(200)
    res.end(data)
  });
}

//create server
app = http.createServer(handler)
app.listen(3000)

//create socket io
io = socket.listen(app)
io.set("log level", 1)

// arduino
board = new five.Board({
  port: "/dev/tty.usbmodem1421"
})

board.on("ready", function() {

  child.exec("open http://localhost:3000/views/index.html")

  io.sockets.on('connection', function (socket){
    socket.emit('board', { status: 'ready' });
  })

  sensor = new five.Sensor({
    pin: "A0",
    freq: 250
  });

  sensor.scale(0,255).on("data", function() {
    var data = this

    io.sockets.emit('sensor', { value: data.value });

  });

});
