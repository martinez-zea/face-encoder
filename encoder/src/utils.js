'use strict';

var chalk = require('chalk')

// # OnErr
// Write errors to sdout
var onErr = function (where, err) {
  console.log( chalk.red.bold('Error on >>', where))
  console.log(chalk.red(err))
  return 1;
}

module.exports.onErr = onErr
