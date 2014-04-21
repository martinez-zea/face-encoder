'use strict';
// # Decode
// main module, where the physical object is translated to a digital image

var five = require('johnny-five')
// local modules
var config = require('./config'),
  logger = require('./logger')


var ir_array = {
  l0: {value: null, binary: 0, color: 'red'},
  l1: {value: null, binary: 0, color: 'red'},
  l2: {value: null, binary: 0, color: 'red'},
  l3: {value: null, binary: 0, color: 'red'},
  l4: {value: null, binary: 0, color: 'red'},
  l5: {value: null, binary: 0, color: 'red'}
}


function Decoder () {
  // state of the system
  this.machine_state = {
    SCANNING : false,
    CALIBRATING: false,
    RUNTIME: null,
    LENGTH: 100 //cm
  }

  this.board = new five.Board({
    port: config.SERIAL_PORT,
    repl: false
  })

}

Decoder.prototype.bootstrap = function() {
  var self = this

  this.board.on('ready', function (){
    logger.log('info', 'board ready')

    //inform the client that we have connection with the board
    // global.io.sockets.on('connection', function (socket){
    //   socket.emit('board', { status: 'ready' });
    // })

    // crate a new instance of motor
    var motor = new five.Motor({
      pins: { pwm: config.MOTOR_PWM, dir: config.MOTOR_DIRECTION}
    });

    // buttons
    var front = new five.Button(config.FRONT_PIN);
    var back = new five.Button(config.BACK_PIN);
    var start = new five.Button(config.START_PIN);

    // ir
    var l0 = new five.Sensor({pin: 'A0', freq: 100})
    var l1 = new five.Sensor({pin: 'A1', freq: 100})
    //var l2 = new five.Sensor({pin: 'A2', freq: 100})
    var l3 = new five.Sensor({pin: 'A3', freq: 100})
    //var l4 = new five.Sensor({pin: 'A4', freq: 100})
    var l5 = new five.Sensor({pin: 'A5', freq: 100})

    // // IR events
    l0.on('read', function (){
      if(this.value < 800){
        ir_array.l0.binary = 0
        ir_array.l0.color = '#7c737c'
      } else {
        ir_array.l0.binary = 1
        ir_array.l0.color = '#1c1a1c'
      }
      ir_array.l0.value = this.value
    })

    l1.on('read', function (){
      if(this.value < 800){
        ir_array.l1.binary = 0
        ir_array.l1.color = '#7c737c'
      } else {
        ir_array.l1.binary = 1
        ir_array.l1.color = '#1c1a1c'
      }
      ir_array.l1.value = this.value
    })

    // l2.on('read', function (){
    //   if(this.value < 800){
    //     ir_array.l2.binary = 0
    //     ir_array.l2.color = '#7c737c'
    //   } else {
    //     ir_array.l2.binary = 1
    //     ir_array.l2.color = '#1c1a1c'
    //   }
    //   ir_array.l2.value = this.value
    // })

    l3.on('read', function (){
      if(this.value < 800){
        ir_array.l3.binary = 0
        ir_array.l3.color = '#7c737c'

        ir_array.l2.binary = 0
        ir_array.l2.color = '#7c737c'
      } else {
        ir_array.l3.binary = 1
        ir_array.l3.color = '#1c1a1c'

        ir_array.l2.binary = 1
        ir_array.l2.color = '#1c1a1c'
      }
      ir_array.l3.value = this.value
    })

    // l4.on('read', function (){
    //   if(this.value < 800){
    //     ir_array.l4.binary = 0
    //     ir_array.l4.color = '#7c737c'
    //   } else {
    //     ir_array.l4.binary = 1
    //     ir_array.l4.color = '#1c1a1c'
    //   }
    //   ir_array.l4.value = this.value
    // })

    l5.on('read', function (){
      if(this.value < 800){
        ir_array.l5.binary = 0
        ir_array.l5.color = '#7c737c'

        ir_array.l4.binary = 0
        ir_array.l4.color = '#7c737c'
      } else {
        ir_array.l5.binary = 1
        ir_array.l5.color = '#1c1a1c'

        ir_array.l4.binary = 1
        ir_array.l4.color = '#1c1a1c'
      }
      ir_array.l5.value = this.value
    })

    this.loop(20, function (){
      global.io.sockets.emit('measure', ir_array)
    })

    // ### Listen to buttons events
    // Button that controls the initiate of the process
    start.on('down', function() {
      logger.log('info','start pressed')

      // if we are not in the middle of a process
      if (!self.machine_state.SCANNING){
        logger.log('info','scanning = true')
        // initiate the motion
        motor.reverse(config.FORWARD_SPEED) //buggy
        self.machine_state.SCANNING = true
        global.io.sockets.emit('status', {board: 'scanning'})
      }
    })

    // the object reached the front limit
    front.on('down', function() {
      logger.log('info','front reached')

      motor.reverse(config.REVERSE_SPEED)
      motor.stop()
    })

    // back to home, ready to start again
    back.on('down', function() {
      logger.log('info','back reached')

      // again verify that its doing something
      if (self.machine_state.SCANNING) {
        // stop the motor
        motor.stop()
        motor.forward(config.FORWARD_SPEED)
        //reset the state
        self.machine_state.SCANNING = false
        global.io.sockets.emit('status', {board: 'portrait'})
      }
    })

  })
}

Decoder.prototype.where_am_i = function(time) {
  return (this.machine_state * time)/this.machine_state.LENGTH
}


module.exports = Decoder
