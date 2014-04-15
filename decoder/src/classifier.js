'use strict';
// # Classifier
// Implement a neural network (provided by ```brain```) in order to guess the
// size of each block of the object
//
// dependences
var brain = require('brain'),
  chalk = require('chalk'),
  fs = require('fs'),
  utils = require('./utils'),
  //sample readings
  empty = require('./samples/EMPTY').samples,
  five = require('./samples/FIVE').samples,
  ten = require('./samples/TEN').samples,
  fiveteen = require('./samples/FIVETEEN').samples,
  twenty = require('./samples/TWENTY').samples,
  twenty_five = require('./samples/TWENTY_FIVE').samples,
  thirty = require('./samples/THIRTY').samples


// heights of the object
var height = {
  EMPTY : 0,
  FIVE : 0.1,
  TEN : 0.2,
  FIVETEEN : 0.4,
  TWENTY : 0.5,
  TWENTY_FIVE : 0.7,
  THIRTY : 0.8,
  FINISH : 1
}

// # heightClassifier
// the network
var heightClassifier = new brain.NeuralNetwork()

// # Train
// train the classifier with some data of the height ranges available in the
// physical object obtained by ```learn```
var train = function () {
  // concatenate all the arrays
  var samples = empty.concat(five, ten, fiveteen, twenty, twenty_five, thirty)
  console.log('id',samples)
  console.log( chalk.green('learning time: ') )

  // start measuring execution time
  console.time('train')
  // Train the network with the samples
  heightClassifier.train(samples, {
      errorThresh: 0.00004,  // error threshold to reach
      iterations: 20000,   // maximum training iterations
      log: true,           // console.log() progress periodically
      logPeriod: 10        // number of iterations between logging
    })

  // stop timer
  console.timeEnd('train')

  // dump the trained network to a file

  var net = heightClassifier.toJSON()

  var path = __dirname + '/network/net.json'
  // write to file
  fs.writeFile(path, JSON.stringify(net), function(err) {
      // error handling
      if(err) {
          return utils.onErr('saving file', err)
      }

      // if OK then restart process
      console.log( chalk.green('Successfully saved network to file') )
  });

}

// # Guess
// wrapper to ```brain.run()```.
// execute a query to the network
var guess = function (data){

  console.log( chalk.green('querying time: ') )

  // start measuring execution timer
  console.time('train')
  var response = heightClassifier.run([data])
  // stop timer
  console.timeEnd('train')

  return response
}

// # Exports
module.exports.height = height
module.exports.heightClassifier = heightClassifier
module.exports.train = train
module.exports.guess = guess
