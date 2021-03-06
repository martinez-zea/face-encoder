'use strict';
// # Encoder
// The program takes a photo, looks for a face, scale it and finally produces
// a svg file ready for production via CNC

// # requirements
var program = require('commander')

// local modules
var picture = require('./picture'),
  portrait = require('./portrait'),
  Server = require('./server'),
  logger = require('./logger'),
  Svg = require('./svg'),
  Mailer = require('./email')


// command line options
program
  .version('0.1.0')
  .option('-p, --picture', '--picture <input> <output>')
  .option('-r, --portrait', '--portrait <input>')
  .option('-s, --server', 'initiate the server')
  .option('-d, --draw', 'draw the svg file')
  .option('-e, --email', 'send emails')
  .parse(process.argv);

// # Picture
// initialize the program to test the image processing modules
if (program.picture) {
  // if got input and output parameters
  if (program.args.length === 2) {
    // input and output files
    var input_file = program.args[0]
    var ouput_file = program.args[1]

    logger.log('Processing: ' + input_file + ' to: ' + ouput_file )

    // call the method to run opencv and graphicsmagic
    picture.findFace(input_file, ouput_file, function (err){
      if (err) {
        logger.log('error', 'error in picture processing: ' + err )
      } else {
        logger.log('info', 'successfully processed the image')
      }
    })

  } else{
    // if the parameters are not present
    logger.log('err','An input and output image paths must be provided' )
    // exit the software
    process.exit()
  }
}

// # Portrait
// extract the pixel values from the given image
if (program.portrait) {
  // get the input filename
  var input_file = program.args[0]
  //run the image processing
  portrait.extract(input_file, function (data) {
    logger.log('info', 'portrait data: ' + data)
  })
}

// # server
// main mode oh operation, executes a webserver to interact with the visitors
if (program.server){
  // instantiate and run the server
  var server = new Server()
  server.run()
}

// # svg
if (program.draw) {

  // call the extract method
  portrait.extract('static/img/test.png', function (data) {
    logger.log('info', 'portrait data: ' + data)

    var svg = new Svg(data)

    svg.write()
  })
}

if (program.email){
  var mailer = new Mailer()
  mailer.sendEmails()
}
