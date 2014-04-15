'use strict';

var config = require('./config'),
  _ = require('lodash'),
  chalk = require('chalk')

// # digitalSmooth
// Remove noise from the raw signal given by the sensor. Basically, after
// order an array of lectures, some samples are dropped and then the average
// is returned
//
// filter based on
// [this entry](http://playground.arduino.cc/Main/DigitalSmooth)
// from Arduino's playground
//

var index = 0

function digitalSmooth (rawIn, rawArray, callback) {
  var sorted, bottom, top

  // input new data into the oldest slot
  rawArray[index] = rawIn

  // update the sampler index counter
  if(index < config.MAX_SAMPLES){
    index++
  } else {
    index = 0
  }

  // clone and sort the array. Magic provided by lodash.js
  sorted = _.sortBy(rawArray)

  // throw out top and bottom 15% of samples
  // limit to throw out at least one from top and bottom
  bottom = Math.max(((config.MAX_SAMPLES * 15)/100), 1)
  top = Math.min(((config.MAX_SAMPLES * 85)/100)+1, config.MAX_SAMPLES - 1)

  // Calculate the average
  var sum = 0;
  var elements = 0;
  for(var i = bottom; i < top; i++){
    sum += sorted[i]
    elements++
  }

  var smoothed = sum/elements

  // drop NaN
  if (smoothed) {
    // return the cleaned data
    callback(smoothed, rawIn)
  }
}


// # OnErr
// Write errors to sdout
function onErr(where, err) {
  console.log( chalk.red.bold('Error on >>', where))
  console.log(chalk.red(err))
  return 1;
}


module.exports.digitalSmooth = digitalSmooth
module.exports.onErr = onErr
