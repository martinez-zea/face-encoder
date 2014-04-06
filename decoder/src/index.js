// # Decoder
// ```
// martinez-zea
// 2014
// http://martinez-zea.info
//
// Code under a Fair License
// ```
// A program that control the decoder machine, read and process data collected
// via a distance measure sensor and decode it in order to display an image that
// is saved in a physical object.
//
// ## Dependences
// we use an excellent node.js module to interact with an Arduino board called
// johnny-five; to send data to a browser a simple web server is created with
// real time communication via socket.io
//
var http = require('http'),
  socket = require('socket.io'),
  fs = require('fs'),
  child = require("child_process"),
  five = require("johnny-five"),
  _ = require("lodash")

// local modules
var classifier = require("./classifier")

// vars to hold the server, Arduino board and socket.io
var app, board, io,
  SERVER_PORT = 3000,
  SERIAL_PORT = "/dev/tty.usbmodem1421"

// Hardware variables
var motor, front,
  back, start,
  // pins and speed of the motor
  MOTOR_PWM = 9,
  MOTOR_DIRECTION = 8,
  FORWARD_SPEED = 200, //really slow, it's inverted
  REVERSE_SPEED = 255
  FRONT_PIN = 7,
  BACK_PIN = 4,
  START_PIN = 2

// variables to store data analysis and conversion
var sensor_lectures = [],
  max_samples = 20,
  sensor,
  index = 0,
  previous_read = null,
  previous_decode = null,
  portrait = []

// state of the system
var machine_state = {
  SCANNING : false
}

// Very simple web server,
// in posteriors versions could be replaced with something like Express.js
function handler (req, res) {
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

//Create the web server listening in the port 3000
app = http.createServer(handler)
app.listen(SERVER_PORT)

// Start socket.io with not so verbose logging
io = socket.listen(app)
io.set("log level", 1)

// Instantiate the Arduino lib
board = new five.Board({
  port: SERIAL_PORT
})

// Open browser
/*
child.exec("open http://localhost:3000/views/index.html")
*/


// Initialize trainer
classifier.train()

// # Johnny-five main method
board.on("ready", function() {



  // # Setup board
  // Instantiate the sensor, and configure it to read each 10ms
  sensor = new five.Sensor({
    pin: "A0",
    freq: 10
  });

  // crate a new instance of motor
  motor = new five.Motor({
    pins: { pwm: MOTOR_PWM, dir: MOTOR_DIRECTION}
  });

  // buttons
  front = new five.Button(FRONT_PIN);
  back = new five.Button(BACK_PIN);
  start = new five.Button(START_PIN);

  // inject data to the REPL
  board.repl.inject({
    motor: motor,
    classifier: classifier
  });

  // inform the client that we have connection with the board
  io.sockets.on('connection', function (socket){
    socket.emit('board', { status: 'ready' });
  })

  // ### Listen to buttons events

  // Button that controls the initiate of the process
  start.on("down", function() {
    console.log("start pressed")

    // if we are not in the middle of a process
    if (!machine_state.SCANNING){
      // initiate the motion
      motor.forward(FORWARD_SPEED) //buggy
      machine_state.SCANNING = true
    }
  })

  // the object reached the front limit
  front.on("down", function() {
    console.log("front reached")

    // verify that the process is on going
    if (!machine_state.SCANNING) {
      motor.reverse(REVERSE_SPEED)
    }
  })

  // back to home, ready to start again
  back.on("down", function() {
    console.log("back reached")

    // again verify that its doing something
    if (!machine_state.SCANNING) {
      // stop the motor
      motor.stop()
      //reset the state
      machine_state.SCANNING = false
    }
  })

  // ## Sensor data
  // Here is where the magic happens. When a new lecture is received it is
  // processed first to clean noise from the signal, then, the cleaned data is
  // analyzed in order to find the information encoded in to the object, finally
  // the *decoded object* is sent to the client to visualize it.
  sensor.scale(0,1).on("data", function() {

    digitalSmooth(this.value, sensor_lectures, function(smooth, raw){

      //console.log(smooth)
      var guess = classifier.guess(smooth)
      decode(guess)

      io.sockets.emit('sensor', { raw: raw, smooth: smooth });
    })

  });

});


// on going ....
function decode (data) {
 console.log("data",data)
//   if (previous_read !== data) {


    switch (true){
      case data > 0 && data < 0.2:
        console.log("empty")
        //buildPortrait(-1)
        break

      case data > 0.2 && data < 0.4:
        console.log("5mm") //base
        //buildPortrait(0)
        break

      // case data > 0.4 && data < 0.5:
      //   console.log("10mm") //1
      //   //buildPortrait(1)
      //   break

      // case data > 0.5 && data < 0.7:
      //   console.log("15mm") //2
      //   //buildPortrait(2)
      //   break

      // case data > 0.7 && data < 0.8:
      //   console.log("20mm") //3
      //   //buildPortrait(3)
      //   break

      // case data > 0.8 && data > 0.8:
      //   console.log("25mm") //4
      //   //buildPortrait(4)
      //   break

      // case data > 0.8 && data < 1:
      //   console.log("30mm") //5
      //   //buildPortrait(5)
      //   break

      // case data <= 150:
      //   console.log("35mm") //6
      //   //buildPortrait(6)
      //   break

      default:
        console.log("data", data)
        break
    }

  //   previous_read = data
  // }
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
    console.log(portrait)
    previous_decode = measure
  };
  console.log(portrait)
}

function portraitDone(data){
  console.log("portrait",data)
}


// # digitalSmooth
// Remove noise from the raw signal given by the sensor. Basically, after
// order an array of lectures, some samples are dropped and then the average
// is returned
//
// filter based on
// [this entry](http://playground.arduino.cc/Main/DigitalSmooth)
// from Arduino's playground
//
function digitalSmooth (rawIn, rawArray, callback) {
  var sorted, bottom, top

  // input new data into the oldest slot
  rawArray[index] = rawIn

  // update the sampler index counter
  if(index < max_samples){
    index++
  } else {
    index = 0
  }

  // clone and sort the array. Magic provided by lodash.js
  sorted = _.sortBy(rawArray)

  // throw out top and bottom 15% of samples
  // limit to throw out at least one from top and bottom
  bottom = Math.max(((max_samples * 15)/100), 1)
  top = Math.min(((max_samples * 85)/100)+1, max_samples - 1)

  // Calculate the average
  var sum = 0;
  var elements = 0;
  for(var i = bottom; i < top; i++){
    sum += sorted[i]
    elements++
  }

  var smoothed = sum/elements

  // drop NaN
  if (smoothed) {
    // return the cleaned data
    callback(smoothed, rawIn)
  };
}
