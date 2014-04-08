// # Picture
var gm = require('gm'),
  cv = require('opencv')
  fs = require('fs'),
  chalk = require('chalk'),
  config = require('./config'),
  utils = require('./utils')


var produceThumb = function (input, ouput, width, height, x, y){
  gm(input)
    .crop(width, height, x, y)
    .colorspace('GRAY')
    .colors(config.NUMBER_OF_COLORS)
    .scale(config.IMAGE_WIDTH, config.IMAGE_HEIGHT)
    .write(ouput, function (err) {
      if (err){
        utils.onErr('saving file ', err)
      }
      console.log( chalk.green("Image " + input + " sucessfully cropped") )
  });

}

var findFace = function (input, ouput){
  cv.readImage(input, function(err, im){
    im.detectObject(cv.FACE_CASCADE, {min:[100,100]}, function(err, faces){
      if (faces.length > 1){
        console.log( chalk.red.bold("Found more than ONE face") )
      } else if (faces.length === 0){
        console.log( chalk.red.bold("ZERO faces found :( ") )
      } else if (faces.length === 1){
        var face = faces[0]

        // im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height]);
        // im.save(ouput)
        produceThumb(input, ouput, face.height, face.height, face.x, face.y)
      }
    });
  })

}

module.exports.findFace = findFace
