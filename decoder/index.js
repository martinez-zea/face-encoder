//system
var http = require('http'),
  socket = require('socket.io'),
  fs = require('fs'),
  child = require("child_process"),
  five = require("johnny-five"),
  _ = require("lodash"),
  app, board, io

//data
var sensor_lectures = [],
  max_samples = 20,
  sensor,
  index = 0

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
    freq: 25
  });

  sensor.on("data", function() {

    digitalSmooth(this.value, sensor_lectures, function(smooth, raw){
      io.sockets.emit('sensor', { raw: raw, smooth: smooth });
    })

  });

});

// filter based on:
// http://playground.arduino.cc/Main/DigitalSmooth
function digitalSmooth (rawIn, rawArray, callback) {
  var sorted, bottom, top

  rawArray[index] = rawIn // input new data into the oldest slot

  if(index < max_samples){
    index++
  } else {
    index = 0
  }

  sorted = _.sortBy(rawArray) //clone and sort

  // throw out top and bottom 15% of samples
  // limit to throw out at least one from top and bottom
  bottom = Math.max(((max_samples * 15)/100), 1)
  top = Math.min(((max_samples * 85)/100)+1, max_samples - 1)

  // average
  var sum = 0;
  var elements = 0;
  for(var i = bottom; i < top; i++){
    sum += sorted[i]
    elements++
  }

  var smoothed = sum/elements

  // drop NaN
  if (smoothed) {
    callback(smoothed, rawIn)
  };

}

