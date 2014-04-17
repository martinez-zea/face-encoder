'use strict';

var http = require('http'),
  Router = require('node-simple-router'),
  i18n = require('i18next'),
  socket = require('socket.io'),
  Template = require('./template'),
  config = require('./config'),
  utils = require('./utils'),
  local_config = require('./local_config'),
  views = __dirname + '/views',
  logger = require('./logger'),
  Database = require('./database'),
  Picam = require('./picam'),
  picture = require('./picture'),
  io

// configuration for 18n
i18n.init({
  //default language from config
  lng: local_config.LANGUAGE,
  ns: 'translation',
  resGetPath: __dirname + '/locales/__ns__-__lng__.json'
})

function Webserver () {
   this.static_files = __dirname + '/static'

  // instantiate the router
  this.router = new Router({
    logging: false,
    log: console.log,
    static_route: this.static_files,
    serve_static: true
  })

  this.database = new Database(__dirname + '/static/users.db')
}

Webserver.prototype.run = function() {
  // setup routes
  this.index()
  this.receive()
  this.picture()

  // start the server
  this.server = http.createServer(this.router);
  this.server.listen(config.PORT);

  logger.log('info', 'web server running at port: ' + config.PORT)

  io = socket.listen(this.server)
  io.set('log level', 1)

}

Webserver.prototype.index = function() {
  this.router.get('/', function (req, res) {
    logger.log('info', 'webserver GET /')

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

      // navigation
      next: i18n.t('next'),
      previous: i18n.t('previous'),
      loading: i18n.t('loading'),
      finish: i18n.t('finish'),


      instructions: i18n.t('instructions')
    }

    var template = new Template(views+'/base.html')
    template.compile(function (err, data){
        if(err){
          utils.onErr('Compiling base', err)
        } else {
          res.end(data(params))
        }
    })
  })
};

Webserver.prototype.receive = function() {
  var self = this

  this.router.post('/userDone', function (req, res){
    logger.log('info', 'webserver POST /userDone')

    // TODO: attach image and svg
    var doc = {
      username: req.post.username,
      email: req.post.email,
      status: 'wating'
    }

    self.database.insert(doc, function (err, newDoc){
      if (err) {
        res.end('ERROR 500 : ' + err )
      } else{
        res.end(JSON.stringify(newDoc))
      }
    })
  })
}

Webserver.prototype.picture = function() {
  this.router.get('/picture', function (req, res){
    logger.log('info', 'webserver GET /picture')

    var dir = __dirname+'/static/img/'
    var uuid = utils.guid()
    var orig = uuid+'.png'
    var face = uuid+'_face.png'

    var picam = new Picam(orig, function (err){
        if(err){
          utils.onErr('shutting', err)
          res.end('Error 500')
        } else {
          picture.findFace( dir+orig, dir+face, function (err){
            if(err){
              data = {
                error: err,
                orig: null,
                face: null
              }
              res.end(JSON.stringify(data))
            }

            data = {
                error: null,
                orig: orig,
                face: face
              }
              res.end(JSON.stringify(data))
          })
        }
    })
  })
}

module.exports = Webserver


