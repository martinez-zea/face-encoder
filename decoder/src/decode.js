'use strict';
// # Decode
// main module, where the physical object is translated to a digital image

var fs = require('fs'),
  io = require('socket.io'),
  five = require('johnny-five'),
  _ = require('lodash'),
  chalk = require('chalk')

// local modules
var config = require('./config'),
  utils = require('./utils'),
  server = require('./server')

// vars to hold the server, Arduino board and socket.io
var board

// Hardware variables
var motor, front,
  back, start

var ir_array = {
  M1: {pin: 0, value: null, binary: 0, color: 'red'},
  M2: {pin: 1, value: null, binary: 0, color: 'red'},
  M3: {pin: 2, value: null, binary: 0, color: 'red'},
  M4: {pin: 3, value: null, binary: 0, color: 'red'},
  M5: {pin: 4, value: null, binary: 0, color: 'red'},
  M6: {pin: 5, value: null, binary: 0, color: 'red'}
}


// state of the system
var machine_state = {
  SCANNING : false
}


//# setup
// initialize all the environment
function setup() {

  server.initiate()

  // Instantiate the Arduino lib
  console.log( chalk.gray('connecting to hardware') )
  board = new five.Board({
    port: config.SERIAL_PORT,
    repl: false
  })
}


function main() {
  // # Johnny-five main method
  board.on('ready', function() {

    //inform the client that we have connection with the board
    global.io.sockets.on('connection', function (socket){
      socket.emit('board', { status: 'ready' });
    })


    // # Setup board
    // Instantiate the sensor, and configure it to read each 10ms
    var that = this
    _.forEach(ir_array, function (item, key){
      that.pinMode(item.pin, five.Pin.ANALOG)
    })

    // this.loop(25, function() {
    //   _.forEach(ir_array, function (item, key){
    //     that.analogRead(item.pin, function (voltage) {
    //       item.value = voltage
    //       if (voltage < 800) {
    //         item.binary = 0
    //         item.color = '#7c737c'
    //       } else{
    //         item.binary = 1
    //         item.color = '#1c1a1c'
    //       }
    //     })
    //   })
    //   io.sockets.emit('measure', ir_array);
    //   //console.log('ir_array',ir_array)
    // })

    // crate a new instance of motor
    motor = new five.Motor({
      pins: { pwm: config.MOTOR_PWM, dir: config.MOTOR_DIRECTION}
    });

    // buttons
    front = new five.Button(config.FRONT_PIN);
    back = new five.Button(config.BACK_PIN);
    start = new five.Button(config.START_PIN);


    // ### Listen to buttons events

    // Button that controls the initiate of the process
    start.on('down', function() {
      console.log('start pressed')

      // if we are not in the middle of a process
      if (!machine_state.SCANNING){
        // initiate the motion
        motor.forward(config.FORWARD_SPEED) //buggy
        machine_state.SCANNING = true
      }
    })

    // the object reached the front limit
    front.on('down', function() {
      console.log('front reached')

      // verify that the process is on going
      if (!machine_state.SCANNING) {
        motor.reverse(config.REVERSE_SPEED)
      }
    })

    // back to home, ready to start again
    back.on('down', function() {
      console.log('back reached')

      // again verify that its doing something
      if (!machine_state.SCANNING) {
        // stop the motor
        motor.stop()
        //reset the state
        machine_state.SCANNING = false
      }
    })

  })

  // # buidPortrait
  // build an array with the translated data
  function buildPortrait (measure) {
    // somthing will happen here
  }

  function portraitDone(data){
    console.log('portrait',data)
  }
}

module.exports.setup = setup
module.exports.main = main
