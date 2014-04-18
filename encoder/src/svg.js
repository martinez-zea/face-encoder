'use strict';

// # SVG
// draw a svg from the given array
var Path = require('paths-js/path'),
  fs = require('fs'),
  Template = require('./template'),
  utils = require('./utils'),
  logger = require('./logger')

// Constructor
function Svg (input) {
  // input data array
  this.input = input
}

// build the path
Svg.prototype.draw = function(callback) {
  // TODO: extract data from this.input
  this.path = Path()
    .moveto(10, 20)
    .lineto(30, 50)
    .lineto(25, 28)
    .qcurveto(27, 30, 32, 27)
    .closepath();

  callback(this.path.print())
}

// Compile the template
Svg.prototype.tpl = function(input, callback) {
  // var tpl = new Template(__dirname+'/views/svg.txt')
  var tpl = new Template(input)
  tpl.compile(function (err, data){
    if (err) {
      utils.onErr('compiling svg template', err)
    } else{
      callback(data)
    }
  })
}

// main fuction
Svg.prototype.write = function() {
  var self = this
  // compile template
  this.tpl(__dirname+'/views/svg.txt', function (template){
    // extract data
    self.draw(function (svgData){
      var params = {
        data: svgData
      }
      // output to disc
      self.toDisc(__dirname+'/static/svg/test.svg', template(params))
    })
  })
}

// write file to disc
Svg.prototype.toDisc = function(output, data) {
  fs.writeFile(output, data, function(err) {
      if(err) {
        utils.onErr('writing svg to disk', err)
      } else {
        logger.log('info', 'file saved')
      }
  })
}

module.exports = Svg
