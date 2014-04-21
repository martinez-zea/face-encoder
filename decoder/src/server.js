'use strict';

var http = require('http'),
  fs = require('fs'),
  Router = require('node-simple-router'),
  socket = require('socket.io'),
  hbs = require('handlebars'),
  i18n = require('i18next'),
  chalk = require('chalk'),
  config = require('./config'),
  utils = require('./utils'),
  localConfig = require('./local_config'),
  views = __dirname + '/views',
  io

// configuration for 18n
i18n.init({
  //default language from config
  lng: localConfig.LANGUAGE,
  ns: 'translation',
  resGetPath: __dirname + '/locales/__ns__-__lng__.json'
})

function Server () {
  this.staticFiles = __dirname + '/static'

  // instantiate the router
  this.router = new Router({
    logging: false,
    log: console.log,
    static_route: this.staticFiles,
    serve_static: true
  })
}

Server.prototype.initiate = function (){
  // routes
  this.index()
  this.scanning()
  this.portrait()

  // start the web server
  console.log( chalk.magenta('web serer running at port: ' + config.SERVER_PORT ) )
  var server = http.createServer(this.router)
  server.listen(config.SERVER_PORT)

  // Start socket.io with not so verbose logging
  console.log( chalk.gray('initializing socket.io') )
  global.io = io = socket.listen(server)
  io.set('log level', 2)
}

Server.sendResponse = function (res, data, params){
  res.end(data(params))
}

Server.loadAndCompile = function (filename, callback){
  fs.readFile(filename, 'utf8', function (err, data) {
      if (err) {
        utils.onErr('Ups! error opening file: ' + filename + ' : ' + err)
        callback(null, err)
      }
      callback(hbs.compile(data), null)
    });
}

Server.prototype.index = function (){

  this.router.get('/', function (req, res) {
    console.log( chalk.gray('get /') )

    var params = {
      title: i18n.t('title'),
      // titles
      first_step_title: i18n.t('first_step_title'),
      second_step_title: i18n.t('second_step_title'),
      third_step_title: i18n.t('third_step_title'),
      four_step_title: i18n.t('four_step_title'),
      five_step_title: i18n.t('five_step_title'),

      // content
      first_content: i18n.t('first_content'),
      name_instruction: i18n.t('name_instruction'),
      email_instruction: i18n.t('email_instruction'),
      picture_instruction: i18n.t('picture_instruction'),

      instructions: i18n.t('instructions')
    }

    Server.loadAndCompile(views+'/base.html', function(data, err){
      if (err) {
        utils.onErr('compiling base', err)
      } else{
        Server.sendResponse(res, data, params)
      }
    })
  })
}

Server.prototype.scanning = function (){

  this.router.get('/scanning', function (req, res) {
    console.log( chalk.gray('get /scanning') )

    var params = {
      title: i18n.t('title'),
      // titles
      first_step_title: i18n.t('first_step_title'),
      second_step_title: i18n.t('second_step_title'),
      third_step_title: i18n.t('third_step_title'),
      four_step_title: i18n.t('four_step_title'),
      five_step_title: i18n.t('five_step_title'),

      // content
      first_content: i18n.t('first_content'),
      name_instruction: i18n.t('name_instruction'),
      email_instruction: i18n.t('email_instruction'),
      picture_instruction: i18n.t('picture_instruction'),

      instructions: i18n.t('instructions')
    }

    Server.loadAndCompile(views+'/scanning.html', function(data, err){
      if (err) {
        utils.onErr('compiling scanning', err)
      } else{
        Server.sendResponse(res, data, params)
      }
    })
  })
}

Server.prototype.portrait = function (){

  this.router.get('/portrait', function (req, res) {
    console.log( chalk.gray('get /portrait') )

    var params = {
      title: i18n.t('title'),
      // titles
      first_step_title: i18n.t('first_step_title'),
      second_step_title: i18n.t('second_step_title'),
      third_step_title: i18n.t('third_step_title'),
      four_step_title: i18n.t('four_step_title'),
      five_step_title: i18n.t('five_step_title'),

      // content
      first_content: i18n.t('first_content'),
      name_instruction: i18n.t('name_instruction'),
      email_instruction: i18n.t('email_instruction'),
      picture_instruction: i18n.t('picture_instruction'),

      instructions: i18n.t('instructions')
    }

    Server.loadAndCompile(views+'/portrait.html', function(data, err){
      if (err) {
        utils.onErr('compiling scannig', err)
      } else{
        Server.sendResponse(res, data, params)
      }
    })
  })
}

module.exports = Server
