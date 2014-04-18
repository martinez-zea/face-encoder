'use strict';
// # Template
// load and compile handlebars templates

// requirements
var fs = require('fs'),
  hbs = require('handlebars'),
  utils = require('./utils'),
  logger = require('./logger')

// Constructor
function Template (filename) {
  this.filename = filename
}

// load the template from the filesystem
Template.prototype.load = function(callback) {
  fs.readFile(this.filename, 'utf8', function (err, data) {
      if (err) {
        utils.onErr('Ups! error opening file: ' + this.filename + ' : ' + err)
        callback(err, null)
      }
      logger.log('info', 'template loaded')
      callback(null, data)
    })
}


// compile and return a template
Template.prototype.compile = function(callback) {
  // load the file
  this.load(function (err, data){
    if(err){
      callback(err, null)
    }
    logger.log('info', 'template compiled')
    callback(null, hbs.compile(data))
  })
}

module.exports = Template
