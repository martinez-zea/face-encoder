'use strict';

// # Logger
// http://docs.nodejitsu.com/articles/intermediate/how-to-log
var logger = exports,
  chalk = require('chalk'),
  moment = require('moment')

logger.debugLevel = 'info'

logger.cases = {
  info: function (){
    return console.log( chalk.gray(arguments[0] +': '+ arguments[1]) )
  },
  warn: function (){
    return console.log( chalk.yellow(arguments[0] +': '+ arguments[1]) )
  },
  err: function (){
    return console.log( chalk.red(arguments[0] +': '+ arguments[1]) )
  },
  _default: function (){
    return console.log( chalk.gray(arguments[0] +': '+ arguments[1]) )
  }
}

logger.delegator = function (){
  var args, key, delegate;

  // Transform arguments list into an array
  args = [].slice.call( arguments );

  // shift the case key from the arguments
  key = args.shift();

  // Assign the default case handler
  delegate = logger.cases._default;

  // Derive the method to delegate operation to
  if ( logger.cases.hasOwnProperty( key ) ) {
    delegate = logger.cases[ key ];
  }

  // The scope arg could be set to something specific,
  // in this case, |null| will suffice
  return delegate.apply( null, args );
}


logger.log = function (level, message) {
  var when = moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
  logger.delegator(level, when, message)
}
