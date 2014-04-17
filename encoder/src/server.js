'use strict';

var http = require('http'),
  Router = require('node-simple-router'),
  i18n = require('i18next'),
  chalk = require('chalk'),
  Template = require('./template'),
  config = require('./config'),
  utils = require('./utils'),
  local_config = require('./local_config'),
  views = __dirname + '/views'

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
}

Webserver.prototype.run = function() {
  this.index()
  this.receive()

  // start the server
  this.server = http.createServer(this.router);
  this.server.listen(config.PORT);

  console.log( chalk.magenta('web server running at port: ' + config.PORT ) )
}

Webserver.prototype.index = function() {
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
  this.router.post('/userDone', function (req, res){
    console.log( chalk.gray('post /receive') )

    // req.post.email
    // req.post.username

    res.end('ok')
  })
}


module.exports = Webserver


