'use strict';

// #Picam
// interact with the raspberry camera
var RaspiCam = require('raspicam'),
  utils = require('./utils'),
  logger = require('./logger')

function Shutter (filename){
  this.camera = new RaspiCam({
    mode: 'photo',
    encoding: 'png',
    output: __dirname+'/static/img/'+filename,
    timeout: 0,
    nopreview: true,
    vflip: true
  })

  var self = this

  this.camera.on('read', function (err){
    if (err) {
      utils.onErr('saving file', err)
    } else{
      logger.log('info', 'saved picture to disc')
      self.camera.stop()
    }
  })
}

Shutter.prototype.click = function() {
  logger.log('info', 'shutting camera')
  this.camera.start()
}

module.exports = Shutter
