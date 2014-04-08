// # Encoder
// Takes a photo, looks for a face, scale it and finally produces
// a svg file ready for digital production

var program = require('commander'),
  chalk = require('chalk')

var picture = require('./picture')


program
  .version('0.0.1')
  .option('-p, --picture', '--picture <input> <ouput>')
  .parse(process.argv);


if (program.picture) {
  if (program.args.length === 2) {
    var input_file = program.args[0]
    var ouput_file = program.args[1]

    console.log( chalk.green("Processing: " + input_file + " to: " + ouput_file ) )

    picture.findFace(input_file, ouput_file)

  } else{
    console.log( chalk.red.bold("An image path must be provided") )
    process.exit()
  };

};
