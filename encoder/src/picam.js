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
    vflip: true
  })

  logger.log('info', 'shutting camera')
  this.camera.start()

  var self = this

  this.camera.on('read', function (err){
    if (err) {
      utils.onErr('saving file', err)
      callback(err)
    } else{
      logger.log('info', 'saved picture to disc')
      callback(null)
      self.camera.stop()
    }
  })
}

module.exports = Shutter
