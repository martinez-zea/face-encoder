'use strict';
// # Encoder
// Takes a photo, looks for a face, scale it and finally produces
// a svg file ready for digital production

var program = require('commander'),
  chalk = require('chalk')

var picture = require('./picture'),
  portrait = require('./portrait'),
  Server = require('./server')


program
  .version('0.0.1')
  .option('-p, --picture', '--picture <input> <ouput>')
  .option('-r, --portrait', '--portrait <input>')
  .option('-s, --server', 'initate the server')
  .parse(process.argv);


if (program.picture) {
  if (program.args.length === 2) {
    var input_file = program.args[0]
    var ouput_file = program.args[1]

    console.log( chalk.green('Processing: ' + input_file + ' to: ' + ouput_file ) )

    picture.findFace(input_file, ouput_file)

  } else{
    console.log( chalk.red.bold('An image path must be provided') )
    process.exit()
  }
}

if (program.portrait) {
  var input_file = program.args[0]
  portrait.extract(input_file, function (data) {
    console.log( chalk.green('portrait data: ' + data) )
  })
}

if (program.server){
  var server = new Server()
  server.run()
}
