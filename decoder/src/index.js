// # Decoder
// ```
// martinez-zea
// 2014
// http://martinez-zea.info
//
// Code under a Fair License
// ```
// A program that control the decoder machine, read and process data collected
// via a distance measure sensor and decode it in order to display an image that
// is saved in a physical object.
//
// # Scripts
// * [classifier.js](classifier.html)
// * [config.js](config.html)
// * [decode.js](decode.html)
// * [learn.js](learn.html)
// * [utils.js](utils.html)
//
// ## Dependences
// we use an excellent node.js module to interact with an Arduino board called
// johnny-five; to send data to a browser a simple web server is created with
// real time communication via socket.io and a copule of node.js modules
//
var version = '0.1.0',
  program = require('commander'),
  chalk = require('chalk'),
  classifier = require('./classifier')
  decode = require('./decode')


// Write banner to the sdout
console.log( chalk.yellow('-----------------------') )
console.log( chalk.magenta.bold('** Decoder **') )
console.log( chalk.magenta('v ' + version) )
console.log( chalk.yellow('-----------------------') )


// Command line options
program
  .version(version)
  .option('-d, --decode', 'Decode a portrait [decode]')
  .option('-l, --learn', 'Prepare data for the classifier')
  .option('-t, --train', 'Train the network')
  .parse(process.argv);

// no options from the command line
if(process.argv.length < 3 || program.decode){
  decode.setup()
  decode.main()
}

if(program.train){
  classifier.train()
}

if (program.learn) {
  var learn = require('./learn')
  learn.getData()
}
