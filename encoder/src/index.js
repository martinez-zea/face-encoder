// # Encoder
// Takes a photo, looks for a face, scale it and finally produces
// a svg file ready for digital production

var program = require('commander'),
  chalk = require('chalk')



program
  .version('0.0.1')
  .option('-p, --picture', 'process a picture')
  .parse(process.argv);


if (program.picture) {
  if (program.args.length > 0) {
    var file = program.args[0]
    console.log( chalk.green("Processing: ", file) )
  } else{
    console.log( chalk.red.bold("An image path must be provided") )
    process.exit()
  };

};
