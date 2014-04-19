'use strict';
// # Server
// Principal module of encoder. This module glues together the modules and the
// interaction with the public

// requirements
var http = require('http'),
  Router = require('node-simple-router'),
  i18n = require('i18next')

// local modules
var Template = require('./template'),
  config = require('./config'),
  utils = require('./utils'),
  local_config = require('./local_config'),
  views = __dirname + '/views',
  logger = require('./logger'),
  Database = require('./database'),
  Picam = require('./picam'),
  picture = require('./picture'),
  Svg = require('./svg'),
  portrait = require('./portrait')

// configuration for 18n
i18n.init({
  //default language from config
  lng: local_config.LANGUAGE,
  ns: 'translation',
  resGetPath: __dirname + '/locales/__ns__-__lng__.json'
})

// Costructor
function Webserver () {
  // define the path for serve static files
  this.static_files = __dirname + '/static'

  // instantiate the router
  this.router = new Router({
    logging: false,
    log: console.log,
    static_route: this.static_files,
    serve_static: true
  })

  // database for store offline the email queue
  this.database = new Database(__dirname + '/static/users.db')
}

// Initialize the server with its routes
Webserver.prototype.run = function() {
  // setup routes
  this.index()
  this.receive()
  this.picture()

  // start the server
  this.server = http.createServer(this.router);
  this.server.listen(config.PORT);

  logger.log('info', 'web server running at port: ' + config.PORT)
}


// Index view
Webserver.prototype.index = function() {
  this.router.get('/', function (req, res) {
    logger.log('info', 'webserver GET /')

    // strings for inject into the HTML document
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
      the_end: i18n.t('the_end'),

      // navigation
      next: i18n.t('next'),
      previous: i18n.t('previous'),
      loading: i18n.t('loading'),
      finish: i18n.t('finish'),

      //msgs
      error_picture: i18n.t('error_picture'),
      processing: i18n.t('processing'),
      result: i18n.t('result'),
      picture_again: i18n.t('picture_again'),


      instructions: i18n.t('instructions')
    }

    // load and compile the email template
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


// This function setup the view to collect the final data from the user
Webserver.prototype.receive = function() {
  var self = this

  this.router.post('/userDone', function (req, res){
    logger.log('info', 'webserver POST /userDone')

    // serialize the received data
    var doc = {
      username: req.post.username,
      email: req.post.email,
      face: req.post.face,
      svg: req.post.svg,
      status: 'wating'
    }

    //insert into db
    self.database.insert(doc, function (err, newDoc){
      if (err) {
        res.end('ERROR 500 : ' + err )
      } else{
        res.end(JSON.stringify(newDoc))
      }
    })
  })
}

// route for take and process the user image
Webserver.prototype.picture = function() {
  this.router.get('/picture', function (req, res){
    logger.log('info', 'webserver GET /picture')

    // file names and path
    var dir = __dirname+'/static/img/'
    var uuid = utils.guid()
    var orig = uuid+'.png'
    var face = uuid+'_face.png'
    var svg = __dirname+uuid+'.svg'

    // instance of Picam for interact with the rpi camera
    var picam = new Picam(orig, function (err){
        if(err){
          utils.onErr('shutting', err)
          res.end('Error 500')
        } else {
          var data ={}
          // call the method for face recognition and image manipulation
          picture.findFace( dir+orig, dir+face, function (err){
            if(err){
              data = {
                error: err,
                orig: null,
                face: null
              }
              // return error
              res.end(JSON.stringify(data))
            }

            // SVG
            portrait.extract(dir+face, function (data){
              var tmp = new Svg(data)
              tmp.write(svg, function (err){
                if (err) {
                  utils.onErr('wiriting svg on view', err)
                } else{
                  data = {
                    error: null,
                    orig: orig,
                    face: face
                  }
                  // return success
                  res.end(JSON.stringify(data))
                }
              })
            })


          })
        }
    })
  })
}

module.exports = Webserver


