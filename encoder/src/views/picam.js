'use strict';

// #Picam
// interact with the raspberry camera
var RaspiCam = require('raspicam')

function Shutter (){
  this.camera = null
}

Shutter.prototype.setup = function(filename) {
  this.camera = new RaspiCam({
    mode: 'photo',
    encoding: 'png',
    output: __dirname+'/static/img/'+filename,
    timeout: 0,
    nopreview: true
  })
}

Shutter.prototype.click = function() {
  this.camera.start()
}

Shutter.prototype.off = function() {
  this.camera.stop()
}

module.exports.shutter = Shutter
