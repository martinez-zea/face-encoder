'use strict';

// #Picam
// interact with the raspberry pi camera
var RaspiCam = require('raspicam'),
  utils = require('./utils'),
  logger = require('./logger')

// Configure, shoot and stop the camera
function Shutter (filename, callback){
  // default configuration to take a single picture
  this.camera = new RaspiCam({
    mode: 'photo',
    encoding: 'png',
    output: __dirname+'/static/img/'+filename,
    timeout: 0,
    nopreview: true,
    vflip: true,
    width: 320,
    height: 240
  })

  logger.log('info', 'shutting camera')
  //take the picture
  this.camera.start()

  var self = this
  // hack to wait for the writing of the file
  var number_reads = 0

  // when the system is writing
  this.camera.on('read', function (err){
    // update the number of calls
    number_reads = number_reads + 1
    if (err) {
      utils.onErr('saving file', err)
      // inform the error
      callback(err)
    } else{
      // if the file is on disc
      if(number_reads > 2){
        logger.log('info', 'saved picture to disc')
        // nothing to return
        callback(null)
        //stop the camera
        self.camera.stop()
      }
    }
  })
}

module.exports = Shutter
