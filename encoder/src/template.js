'use strict';

var fs = require('fs'),
  hbs = require('handlebars'),
  utils = require('./utils')

function Template (filename) {
  this.filename = filename
}

Template.prototype.load = function(callback) {
  fs.readFile(this.filename, 'utf8', function (err, data) {
      if (err) {
        utils.onErr('Ups! error opening file: ' + this.filename + ' : ' + err)
        callback(err, null)
      }
      callback(null, data)
    })
}

Template.prototype.compile = function(callback) {
  this.load(function (err, data){
    if(err){
      callback(err, null)
    }
    callback(null, hbs.compile(data))
  })

}

module.exports = Template
