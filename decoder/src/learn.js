'use strict';
// # Learn
// write a file with data to train the classifier.
// Right now its a little buggy because a crash with the injected johnny-five
// Repl. In order to use this utility, is necessary to do one lecture and then
// restart the program for the next reading.
//
// dependences
var five = require('johnny-five'),
  chalk = require('chalk'),
  prompt = require('prompt'),
  _ = require('lodash'),
  fs = require('fs'),
  config = require('./config'),
  utils = require('./utils'),
  height = require('./classifier').height

// variables to store data and state
var board,
  // temporary array to hold raw data
  sensor_lectures = [],
  // samples to write
  samples = [],
  // flags
  previous = null,
  reading = false,
  // current measure
  state = {
    0 : 'EMPTY',
    1 : 'FIVE',
    2 : 'TEN',
    3 : 'FIVETEEN',
    4 : 'TWENTY',
    5 : 'TWENTY_FIVE',
    6 : 'THIRTY',
    7 : 'FINISH'
  },
  // command line options
  options = [0,1,2,3,20,25,30]



// Inititalize prompt
prompt.start()

// # getData
// main function, configure the board and start to interact
var getData = function () {
  // Write banner to the sdout
  console.log( chalk.white.bold('** Learning from sensor **') )

  // Instantiate the Arduino lib
  board = new five.Board({
    port: config.SERIAL_PORT
  })

  // when the board is ready
  board.on('ready', function() {

    // Instantiate the sensor, and configure it to read each 10ms
    sensor = new five.Sensor({
      pin: config.ANALOG_PIN,
      freq: config.FREQ
    });

    // tell the user we are ready
    console.log(chalk.gray('Ready to take samples'))

    // call ```ask()```
    ask()
  })
}

// # ask
// handle user input and call the function to write to a file
function ask(){
  // print out the question
  console.log(chalk.cyan('Height to sample: '))
  console.log(chalk.gray('0 --> empty'))
  console.log(chalk.gray('1 --> 5mm'))
  console.log(chalk.gray('2 --> 10mm'))
  console.log(chalk.gray('3 --> 15mm'))
  console.log(chalk.gray('4 --> 20mm'))
  console.log(chalk.gray('5 --> 25mm'))
  console.log(chalk.gray('6 --> 30mm'))
  //console.log(chalk.gray('7 --> 35mm'))

  // when have input from user
  prompt.get(['number'], function(err, result){
    // error handle
    if (err) {
      return utils.onErr(err)
    }

    // if the input between the range of options
    if (result.number < 7){
      // change the flag
      reading = true
      //call ```doit```, with the arg of the current reading
      doit(state[result.number])

    // the input is wrong
    } else {
      // ask again for a new input
      ask()
    }
  })
}

// # doit
// read, clean and store the data from the sensor
function doit(sample){
  // when have data from the sensor
  sensor.scale(0,1).on('data', function() {
    if (reading){
      //clean the signal
      utils.digitalSmooth(this.value, sensor_lectures, function(smooth, raw){
        // store a determined amount of readings
        if(samples.length < config.TO_LEARN){
          // if is a new read
          if(previous !== smooth){
            //create an object to store it into the array
            var read = {input: [smooth], output: [height[sample]]}
            samples.push(JSON.stringify(read))

            //console.log('.')

            // remember the last reading
            previous = smooth
          }
        // if the array is full
        } else {
          // create the string to save
          var template = 'module.exports.samples = [' + samples + '] '
          var path = __dirname + '/samples/'+sample+'.js'

          // write to file
          fs.writeFile(path, template, function(err) {
              // error handling
              if(err) {
                  return utils.onErr('saving file', err)
              }

              // if OK then restart process
              console.log( chalk.green('Successfully saved ', sample) );
              //empty the array
              samples = []
              // reset flag
              reading = false
              // call ask again
              ask()
          });
        }
      })
    }
  });
}


module.exports.getData = getData


