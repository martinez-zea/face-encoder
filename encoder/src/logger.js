'use strict';

// # Logger
// http://docs.nodejitsu.com/articles/intermediate/how-to-log
var logger = exports,
  chalk = require('chalk'),
  moment = require('moment')

logger.debugLevel = 'info'

logger.log = function(level, message) {
  var levels = ['error', 'warn', 'info']
  var when = moment().format('dddd, MMMM Do YYYY, h:mm:ss a')

  if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel) ) {
    if (typeof message !== 'string') {
      message = JSON.stringify(message)
    }

    console.log( chalk.gray(when + ' > ' + level+': '+message) )
  }
}
