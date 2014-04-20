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
  classifier = require('./classifier'),
  Decoder = require('./decode'),
  Server = require('./server'),
  childProcess = require('child_process')


// Write banner to the sdout
console.log(chalk.yellow('-----------------------'))
console.log(chalk.magenta.bold('** Decoder **'))
console.log(chalk.magenta('v ' + version))
console.log(chalk.yellow('-----------------------'))


// Command line options
program
    .version(version)
    .option('-d, --decode', 'Decode a portrait [decode]')
    .option('-l, --learn', 'Prepare data for the classifier')
    .option('-t, --train', 'Train the network')
    .option('-b, --browser', 'Automatically open the browser')
    .option('-s, --server', 'Start the web and socket server')
    .parse(process.argv);

// no options from the command line
if (process.argv.length < 3 || program.decode){
  var decoder = new Decoder()
  decoder.bootstrap()
}

if (program.train) {
  classifier.train()
}

if (program.learn) {
  var learn = require('./learn')
  learn.getData()
}

// Initialize server
if (program.server) {
  var server = new Server()
  server.initiate()
}

// Open browser
if (program.browser) {
  // check for the platform where is running the soft
  // to call the default *open* browser command
  if (process.platform === 'darwing') {
      childProcess.exec('open http://localhost:3000/views/index.html')
  } else if (process.platform === 'linux') {
      childProcess.exec('xdg-open http://localhost:3000/views/index.html')
  }
}
