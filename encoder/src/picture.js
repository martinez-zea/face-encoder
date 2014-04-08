// # Picture
var gm = require('gm'),
  fs = require('fs'),
  chalk = require('chalk'),
  config = require('./config'),
  utils = require('./utils')


var indexAndCrop = function (input, ouput) {
  gm(input)
    .colors(config.NUMBER_OF_COLORS)
    .scale(config.IMAGE_WIDTH, config.IMAGE_HEIGHT)
    .write(ouput, function (err) {
      if (err){
        utils.onErr('saving file ', err)
      }
      console.log( chalk.green("Image " + input + " sucessfully processed!") )
  });
}

module.exports.indexAndCrop = indexAndCrop
