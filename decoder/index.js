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
  index = 0,
  previous_read = null,
  previous_decode = null,
  portrait = []

// hardware
var motor, front,
  back, start,
  MOTOR_PWM = 7,
  MOTOR_DIRECTION = 6,
  FORWARD_SPEED = 200, //really slow, it's inverted
  REVERSE_SPEED = 255,
  FRONT_PIN = 8,
  BACK_PIN = 9,
  START_PIN = 10


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

  //child.exec("open http://localhost:3000/views/index.html")

  // motor controll
  motor = new five.Motor({
    pins: { pwm: MOTOR_PWM, dir: MOTOR_DIRECTION}
  });

  board.repl.inject({
    motor: motor
  });

  //end of line
  front = new five.Button(8);
  back = new five.Button(9);
  start = new five.Button(10);

  // logic of buttons
  start.on("down", function() {
    console.log("start");
    motor.forward(FORWARD_SPEED); //buggy
  });

  front.on("down", function() {
    console.log("front");
    motor.reverse(REVERSE_SPEED);
  });

  back.on("down", function() {
    console.log("back");
    motor.stop()
  });


  io.sockets.on('connection', function (socket){
    socket.emit('board', { status: 'ready' });
  })

  sensor = new five.Sensor({
    pin: "A0",
    freq: 25
  });

  sensor.on("data", function() {

    digitalSmooth(this.value, sensor_lectures, function(smooth, raw){
      //trainDecoder(smooth)
     // decode(smooth)
      io.sockets.emit('sensor', { raw: raw, smooth: smooth });
    })

  });

});

function decode (data) {
  var  rounded = Math.round(data)

  //console.log("ro",rounded)
  if (previous_read != rounded) {

    if(rounded >= 290){
      console.log("empty")
      //buildPortrait(-1)
    } else if (rounded < 320 && rounded > 245) {
      console.log("5mm") //base
      //buildPortrait(0)
    } else if (rounded <= 245 && rounded > 230) {
      console.log("10mm") //1
      //buildPortrait(1)
    } else if (rounded <= 230 && rounded > 220) {
      console.log("15mm") //2
      //buildPortrait(2)
    } else if (rounded <= 220 && rounded > 180) {
      console.log("20mm") //3
      //buildPortrait(3)
    } else if (rounded <= 180 && rounded > 165) {
      console.log("25mm") //4
      //buildPortrait(4)
    } else if (rounded <= 165 && rounded > 150) {
      console.log("30mm") //5
      //buildPortrait(5)
    } else if (rounded <= 150 ) {
      console.log("35mm") //5
      //buildPortrait(6)
    } else {
      console.log("rounded", rounded)
    }

    previous_read = rounded
  }
}

function buildPortrait (measure) {
  if (previous_decode != measure) {
    if (measure !== -1 && measure !== 0) {
      portrait.push(measure)
     // console.log("mea",measure)
      // if (measure === 6) {
      //   portraitDone(portrait)
      // };
    }
    //console.log(portrait)
    previous_decode = measure
  };
}

function portraitDone(data){
  console.log("portrait",data)
}

function trainDecoder (data){
  var rounded = Math.round(data)

  if (previous_read != rounded) {
    portrait.push(rounded)
    previous_read = rounded
  }

  var bottom = _.max(portrait)
  var top = _.min(portrait)

  // bottom  324
  // top 165

//   top  166
// bottom 318

// top  176
// bottom 318

  console.log("top ", top)
  console.log("bottom", bottom)
}

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

