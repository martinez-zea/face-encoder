var http = require('http'),
  fs = require('fs'),
  Router = require('node-simple-router'),
  hbs = require('handlebars'),
  _ = require('lodash'),
  chalk = require('chalk'),
  config = require('./config'),
  utils = require('./utils')

var views = __dirname + '/views'


var initiate = function (){


  var static_files = __dirname + '/static'

  // instantiate the router
  var router = new Router({
    logging: false,
    log: console.log,
    static_route: static_files,
  })

  // routes
  index(router)

  // start the server
  var server = http.createServer(router);
  server.listen(config.PORT);

  console.log( chalk.magenta("web serer running at port: " + config.PORT ) )
}

var index = function (router){

  router.get("/", function (req, res) {
    console.log( chalk.gray("get /") )

    var templates = {
      base: views+'/base.html',
      index: views+'/index.html'
    }

    var compiled = {}

    _.forEach(templates, function(template, view){
      loadAndCompile(template, function (data, err){
        if (!err) {
          compiled[view] = data

          if (_.size(compiled) === _.size(templates)){
            sendResponse(res, compiled)
          }
        }
      })
    })
  })

}

var sendResponse = function (res, data){
  var tpl = data.base({"main_content": data.index})
  res.end(tpl)
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


