var http = require('http'),
  fs = require('fs'),
  Router = require('node-simple-router'),
  hbs = require('handlebars'),
  _ = require('lodash'),
  i18n = require('i18next'),
  chalk = require('chalk'),
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


var initiate = function (){
  var static_files = __dirname + '/static'

  // instantiate the router
  var router = new Router({
    logging: false,
    log: console.log,
    static_route: static_files,
    serve_static: true
  })

  // routes
  index(router)
  receive(router)

  // start the server
  var server = http.createServer(router);
  server.listen(config.SERVER_PORT);

  console.log( chalk.magenta("web serer running at port: " + config.PORT ) )
}

var index = function (router){

  router.get("/", function (req, res) {
    console.log( chalk.gray("get /") )

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

    loadAndCompile(views+'/base.html', function(data, err){
      sendResponse(res, data, params)
    })


    })
}


var sendResponse = function (res, data, params){
  res.end(data(params))
}

var loadAndCompile = function (filename, callback){
  fs.readFile(filename, 'utf8', function (err, data) {
      if (err) {
        utils.onErr('Ups! error opening file: ' + filename + " : " + err)
        callback(null, err)
      }

      callback(hbs.compile(data), null)
    });
}

module.exports.initiate = initiate


