'use strict';

var logger = require('./logger')

// # OnErr
// Write errors to sdout
var onErr = function (where, err) {
  logger.log('err', 'Error on >> '+ where)
  logger.log('err', 'traceback: ' + err)
  return 1;
}

module.exports.onErr = onErr
