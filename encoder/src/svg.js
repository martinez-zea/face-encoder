'use strict';

// # SVG
// draw a svg from the given array
var Path = require('paths-js/path'),
  fs = require('fs'),
  _ = require('lodash'),
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
  var max = _.max(this.input)
  var min = _.min(this.input)
  var mapped = []
  var instructions = ''

  _.forEach(this.input, function (val){
      var tmp = utils.map(val, min, max, 5, 25)
      // TODO: review map and conversion of scales
      mapped.push(Math.ceil(tmp))
  })
  console.info(mapped.toString());
  var path = new Path()

  instructions += path.moveto(0,0).print()

  _.forEach(mapped, function (val, index){
    var x = index * 5
    instructions += path.vlineto(val).hlineto(x).print()
  })

  instructions += path.vlineto(0).closepath().print()

  callback(instructions)
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
Svg.prototype.write = function(path, callback) {
  var self = this
  // compile template
  this.tpl(__dirname+'/views/svg.txt', function (template){
    // extract data
    self.draw(function (svgData){
      var params = {
        data: svgData,
        stroke: '#000000',
        fill: '#000000'
      }
      // output to disc
      self.toDisc(path, template(params), callback)
    })
  })
}

// write file to disc
Svg.prototype.toDisc = function(output, data, callback) {
  fs.writeFile(output, data, function(err) {
      if(err) {
        utils.onErr('writing svg to disk', err)
        callback(err)
      } else {
        logger.log('info', 'svg file saved')
        callback(null)
      }
  })
}

module.exports = Svg
