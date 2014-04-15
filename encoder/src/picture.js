'use strict';
// # Picture
// This module process the given image to search a face, then manipulates the
// image in order to generate a new one with reduced size and palette
// ## Dependences
// The face recognition uses Opencv and the image manipulation is done via
// graphicsmagick
var gm = require('gm'),
  cv = require('opencv'),
  fs = require('fs'),
  chalk = require('chalk'),
  config = require('./config'),
  utils = require('./utils')

// #ProduceThumb
// reduce and crop the given image
//
// params:
// ```
// @input: image file
// @output: where to write. Must be a PNG file
// @width: width of the face
// @height: height of the face
// @x: x values of the top corner of face
// @y: y values of the top corner of face
// ```
var produceThumb = function (input, ouput, width, height, x, y){
  //initiate gm
  gm(input)
    // crop the image
    .crop(width, height, x, y)
    // scale it to the final size
    .scale(config.IMAGE_WIDTH, config.IMAGE_HEIGHT)
    // drop color information
    .colorspace('GRAY')
    // reduce the number of colors
    .treeDepth(2)
    .colors(config.NUMBER_OF_COLORS)
    // write the final image
    .write(ouput, function (err) {
      if (err){
        utils.onErr('saving file ', err)
      }
      console.log( chalk.green('Image ' + input + ' sucessfully cropped') )
  });

}

// #FindFace
// look for faces in the given picture
//
// params:
// ```
// @input: input file
// @output: output file
// ```
var findFace = function (input, ouput){
  // plug the image to openCV
  cv.readImage(input, function(err, im){
    // run the detector
    im.detectObject(cv.FACE_CASCADE, {min:[100,100]}, function(err, faces){
      // we only need one face
      if (faces.length > 1){
        console.log( chalk.red.bold('Found more than ONE face') )
      } else if (faces.length === 0){
        console.log( chalk.red.bold('ZERO faces found :( ') )
      } else if (faces.length === 1){
        // chache the data
        var face = faces[0]
        // call the function to produce the final image
        produceThumb(input, ouput, face.height, face.height, face.x, face.y)
      }
    });
  })

}

module.exports.findFace = findFace
