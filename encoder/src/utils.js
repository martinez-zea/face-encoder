'use strict';

var logger = require('./logger')

// # OnErr
// Write errors to sdout
var onErr = function (where, err) {
  logger.log('err', 'Error on >> '+ where)
  logger.log('err', 'traceback: ' + err)
  return 1;
}

// # Guid
// generate a unique identifier for each image
var guid = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

module.exports.onErr = onErr
module.exports.guid = guid
