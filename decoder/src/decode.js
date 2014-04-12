// # Decode
// main module, where the physical object is translated to a digital image

var http = require('http'),
  fs = require('fs'),
  socket = require('socket.io'),
  child = require('child_process'),
  five = require('johnny-five'),
  brain = require('brain'),
  _ = require('lodash'),
  chalk = require('chalk')

// local modules
var config = require('./config'),
  utils = require('./utils')

// vars to hold the server, Arduino board and socket.io
var app, board, io

// Hardware variables
var motor, front,
  back, start, l0,
  l1, l2, l3, l4, l5

var ir_array = {
  M1: {pin: 0, value: null, binary: 0, color: 'red'},
  M2: {pin: 1, value: null, binary: 0, color: 'red'},
  M3: {pin: 2, value: null, binary: 0, color: 'red'},
  M4: {pin: 3, value: null, binary: 0, color: 'red'},
  M5: {pin: 4, value: null, binary: 0, color: 'red'},
  M6: {pin: 5, value: null, binary: 0, color: 'red'}
}

// variables to store data analysis and conversion
var sensor_lectures = [],
  max_samples = 20,
  index = 0,
  previous_read = null,
  previous_decode = null,
  portrait = [],
  network = new brain.NeuralNetwork()

// state of the system
var machine_state = {
  SCANNING : false
}


//# setup
// initialize all the environment
function setup (){
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
  console.log( chalk.gray("initializing webserver") )
  app = http.createServer(handler)
  app.listen(config.SERVER_PORT)

  // Start socket.io with not so verbose logging
  console.log( chalk.gray("initializing socket.io") )
  io = socket.listen(app)
  io.set("log level", 1)

  // Instantiate the Arduino lib
  console.log( chalk.gray("connecting to hardware") )
  board = new five.Board({
    port: config.SERIAL_PORT,
    repl: false
  })

  // Read the trained network
  console.log( chalk.gray("loading network file") )
  fs.readFile(__dirname+'/network/net.json', function (err, data){
    if(err){
      utils.onErr('loading network file', err)
    }

    // translate the input string into a JSON object
    var json = JSON.parse(data.toString())

    // load the data into the network
    network.fromJSON(json)

    console.log( chalk.gray("network file succesfully readed") )
  })

  // Open browser

  child.exec("open http://localhost:3000/views/index.html")

}

function main (){
  // # Johnny-five main method
  board.on("ready", function() {

    // # Setup board
    // Instantiate the sensor, and configure it to read each 10ms
    var that = this
    _.forEach(ir_array, function (item, key){
      that.pinMode(item.pin, five.Pin.ANALOG)
    })

    this.loop(25, function() {
      _.forEach(ir_array, function (item, key){
        that.analogRead(item.pin, function (voltage) {
          item.value = voltage
          if (voltage < 800) {
            item.binary = 0
            item.color = '#7c737c'
          } else{
            item.binary = 1
            item.color = "#1c1a1c"
          }
        })
      })
      io.sockets.emit('measure', ir_array);
      //console.log("ir_array",ir_array)
    })


    // crate a new instance of motor
    motor = new five.Motor({
      pins: { pwm: config.MOTOR_PWM, dir: config.MOTOR_DIRECTION}
    });

    // buttons
    front = new five.Button(config.FRONT_PIN);
    back = new five.Button(config.BACK_PIN);
    start = new five.Button(config.START_PIN);

    // inject data to the REPL
    // board.repl.inject({
    //   motor: motor,
    // });

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
        motor.forward(config.FORWARD_SPEED) //buggy
        machine_state.SCANNING = true
      }
    })

    // the object reached the front limit
    front.on("down", function() {
      console.log("front reached")

      // verify that the process is on going
      if (!machine_state.SCANNING) {
        motor.reverse(config.REVERSE_SPEED)
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
    // sensor.scale(0,1).on("data", function() {

    //   utils.digitalSmooth(this.value, sensor_lectures, function(smooth, raw){
    //     // ask the classifier about the current data
    //     var guess = network.run([smooth])
    //     // send the answer to a function to interpret the data
    //     interpret(guess)

    //     io.sockets.emit('sensor', { raw: raw, smooth: smooth });
    //   })
    // });

    // l0.on('data', function(){
    //   console.log( chalk.red("l0: " + this.boolean) )
    // })
    // l1.on('data', function(){
    //   console.log( chalk.red("l1: " + this.boolean) )
    // })
    // l2.on('data', function(){
    //   console.log( chalk.red("l2: " + this.boolean) )
    // })
    // l3.on('data', function(){
    //   console.log( chalk.red("l3: " + this.boolean) )
    // })
    // l4.on('data', function(){
    //   console.log( chalk.red("l4: " + this.boolean) )
    // })
    // l5.on('data', function(){
    //   console.log( chalk.red("l5: " + this.boolean) )
    // })
  })



  // # Interpret
  // translate the guess obtained from the classifier into the heights
  // of the object
  function interpret (data) {
    switch (true){
      case data > 0 && data < 0.1:
        /*console.log("empty")*/
        buildPortrait(-1)
        break

      case data > 0.1 && data < 0.2:
        /*console.log("5mm") //base*/
        buildPortrait(0)
        break

      case data > 0.2 && data < 0.4:
        /*console.log("10mm") //1*/
        buildPortrait(1)
        break

      case data > 0.4 && data < 0.5:
        /*console.log("15mm") //2*/
        buildPortrait(2)
        break

      case data > 0.5 && data < 0.7:
        /*console.log("20mm") //3*/
        buildPortrait(3)
        break

      case data > 0.7 && data < 0.8:
        /*console.log("25mm") //4*/
        buildPortrait(4)
        break

      case data > 0.8 && data < 1:
        /*console.log("30mm") //5*/
        buildPortrait(5)
        break
      /*
      case data <= 150:
        console.log("35mm") //6
        //buildPortrait(6)
        break
      */
      default:
        console.log( chalk.magenta("unknow data: ", data) )
        break
    }
  }

  // # buidPortrait
  // build an array with the translated data
  function buildPortrait (measure) {
    // if there is a new measure
    if (previous_decode !== measure) {
      // ignore empty and 5mm measures
      if (measure !== -1 && measure !== 0) {

        portrait.push(measure)
       // console.log("mea",measure)
        // if (measure === 6) {
        //   portraitDone(portrait)
        // };
      }
      previous_decode = measure
    };
    //console.log(portrait)
  }

  function portraitDone(data){
    console.log("portrait",data)
  }
}

module.exports.setup = setup
module.exports.main = main
