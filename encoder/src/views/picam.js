'use strict';

// #Picam
// interact with the raspberry camera
var RaspiCam = require('raspicam'),
  camera = new RaspiCam({
    mode: 'photo',
    encoding: 'png',
    output: 'static/img/test.png',
    timeout: 0,
    nopreview: true
  })

camera.on('started', function( err, timestamp ){
  console.log('photo started at ' + timestamp );
});

camera.on('read', function( err, timestamp, filename ){
  console.log('photo image captured with filename: ' + filename );
});

camera.on('exit', function( timestamp ){
  console.log('photo child process has exited at ' + timestamp );
});

camera.start();
