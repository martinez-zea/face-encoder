'use strict';

// #Picam
// interact with the raspberry camera
var RaspiCam = require('raspicam')

var Shutter = {
  camera: null,

  setup: function (filename) {
    this.camera = new RaspiCam({
      mode: 'photo',
      encoding: 'png',
      output: __dirname+'/static/img/'+filename,
      timeout: 0,
      nopreview: true
    })
  },

  click: function(){
    this.camera.start()
  },

  off: function (){
    this.camera.stop()
  },

}

module.exports.shutter = Shutter
