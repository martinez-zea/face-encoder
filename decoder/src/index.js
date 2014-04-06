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
var version = '0.0.2',
  http = require('http'),
  socket = require('socket.io'),
  fs = require('fs'),
  child = require('child_process'),
  five = require('johnny-five'),
  _ = require('lodash'),
  program = require('commander'),
  chalk = require('chalk')

// local modules
var config = require('./config'),
  utils = require('./utils'),
  classifier = require('./classifier')

// vars to hold the server, Arduino board and socket.io
var app, board, io

// Hardware variables
var motor, front,
  back, start

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

// Write banner to the sdout
console.log( chalk.yellow('-----------------------') )
console.log( chalk.magenta.bold('** Decoder **') )
console.log( chalk.magenta('v ' + version) )
console.log( chalk.yellow('-----------------------') )


// Command line options
program
  .version(version)
  .option('-l, --learn', 'Prepare data for the classifier')
  .option('-d, --decode', 'Execute the main program')
  .parse(process.argv);

if (program.learn) {
  var learn = require('./learn')
  learn.getData()
}

// // Very simple web server,
// // in posteriors versions could be replaced with something like Express.js
// function handler (req, res) {
//   fs.readFile(__dirname + req.url, function (err,data) {
//     if (err) {
//       res.writeHead(404)
//       res.end(JSON.stringify(err))
//       return;
//     }
//     res.writeHead(200)
//     res.end(data)
//   });
// }

// //Create the web server listening in the port 3000
// app = http.createServer(handler)
// app.listen(config.SERVER_PORT)

// // Start socket.io with not so verbose logging
// io = socket.listen(app)
// io.set("log level", 1)

// // Instantiate the Arduino lib
// board = new five.Board({
//   port: config.SERIAL_PORT
// })

// // Open browser
// /*
// child.exec("open http://localhost:3000/views/index.html")
// */


// // Initialize trainer
// classifier.train()

// // # Johnny-five main method
// board.on("ready", function() {



//   // # Setup board
//   // Instantiate the sensor, and configure it to read each 10ms
//   sensor = new five.Sensor({
//     pin: config.ANALOG_PIN,
//     freq: config.FREQ
//   });

//   // crate a new instance of motor
//   motor = new five.Motor({
//     pins: { pwm: config.MOTOR_PWM, dir: config.MOTOR_DIRECTION}
//   });

//   // buttons
//   front = new five.Button(config.FRONT_PIN);
//   back = new five.Button(config.BACK_PIN);
//   start = new five.Button(config.START_PIN);

//   // inject data to the REPL
//   board.repl.inject({
//     motor: motor,
//     classifier: classifier
//   });

//   // inform the client that we have connection with the board
//   io.sockets.on('connection', function (socket){
//     socket.emit('board', { status: 'ready' });
//   })

//   // ### Listen to buttons events

//   // Button that controls the initiate of the process
//   start.on("down", function() {
//     console.log("start pressed")

//     // if we are not in the middle of a process
//     if (!machine_state.SCANNING){
//       // initiate the motion
//       motor.forward(config.FORWARD_SPEED) //buggy
//       machine_state.SCANNING = true
//     }
//   })

//   // the object reached the front limit
//   front.on("down", function() {
//     console.log("front reached")

//     // verify that the process is on going
//     if (!machine_state.SCANNING) {
//       motor.reverse(config.REVERSE_SPEED)
//     }
//   })

//   // back to home, ready to start again
//   back.on("down", function() {
//     console.log("back reached")

//     // again verify that its doing something
//     if (!machine_state.SCANNING) {
//       // stop the motor
//       motor.stop()
//       //reset the state
//       machine_state.SCANNING = false
//     }
//   })

//   // ## Sensor data
//   // Here is where the magic happens. When a new lecture is received it is
//   // processed first to clean noise from the signal, then, the cleaned data is
//   // analyzed in order to find the information encoded in to the object, finally
//   // the *decoded object* is sent to the client to visualize it.
//   // sensor.scale(0,1).on("data", function() {

//   //   digitalSmooth(this.value, sensor_lectures, function(smooth, raw){

//   //     //console.log(smooth)
//   //     // var guess = classifier.guess(smooth)
//   //     // decode(guess)

//   //     io.sockets.emit('sensor', { raw: raw, smooth: smooth });
//   //   })

//   // });

// });


// // on going ....
// function decode (data) {
//  console.log("data",data)
// //   if (previous_read !== data) {


//     switch (true){
//       case data > 0 && data < 0.2:
//         console.log("empty")
//         //buildPortrait(-1)
//         break

//       case data > 0.2 && data < 0.4:
//         console.log("5mm") //base
//         //buildPortrait(0)
//         break

//       // case data > 0.4 && data < 0.5:
//       //   console.log("10mm") //1
//       //   //buildPortrait(1)
//       //   break

//       // case data > 0.5 && data < 0.7:
//       //   console.log("15mm") //2
//       //   //buildPortrait(2)
//       //   break

//       // case data > 0.7 && data < 0.8:
//       //   console.log("20mm") //3
//       //   //buildPortrait(3)
//       //   break

//       // case data > 0.8 && data > 0.8:
//       //   console.log("25mm") //4
//       //   //buildPortrait(4)
//       //   break

//       // case data > 0.8 && data < 1:
//       //   console.log("30mm") //5
//       //   //buildPortrait(5)
//       //   break

//       // case data <= 150:
//       //   console.log("35mm") //6
//       //   //buildPortrait(6)
//       //   break

//       default:
//         console.log("data", data)
//         break
//     }

//   //   previous_read = data
//   // }
// }

// function buildPortrait (measure) {
//   if (previous_decode != measure) {
//     if (measure !== -1 && measure !== 0) {
//       portrait.push(measure)
//      // console.log("mea",measure)
//       // if (measure === 6) {
//       //   portraitDone(portrait)
//       // };
//     }
//     console.log(portrait)
//     previous_decode = measure
//   };
//   console.log(portrait)
// }

// function portraitDone(data){
//   console.log("portrait",data)
// }
