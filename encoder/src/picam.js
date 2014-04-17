'use strict';

// #Picam
// interact with the raspberry camera
var RaspiCam = require('raspicam'),
  utils = require('./utils'),
  logger = require('./logger')

function Shutter (filename, callback){
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
  this.camera.start()

  var self = this
  var number_reads = 0

  this.camera.on('read', function (err){
    number_reads = number_reads + 1
    if (err) {
      utils.onErr('saving file', err)
      callback(err)
    } else{
      if(number_reads > 2){
        logger.log('info', 'saved picture to disc')
        callback(null)
        self.camera.stop()
      }
    }
  })
}

module.exports = Shutter
