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

  console.log("static_files",static_files)

  // instantiate the router
  var router = new Router({
    logging: true,
    log: console.log,
    static_route: static_files,
    serve_static: true
  })

  // routes
  index(router)
  receive(router)

  // start the server
  var server = http.createServer(router);
  server.listen(config.PORT);

  console.log( chalk.magenta("web serer running at port: " + config.PORT ) )
}

var index = function (router){

  router.get("/", function (req, res) {
    console.log( chalk.gray("get /") )

    var params = {
      title: 'decoder',
      // titles
      first_step_title: 'Welcome',
      second_step_title: 'name',
      third_step_title: 'email',
      four_step_title: 'picture',
      five_step_title: 'done',

      // content
      first_content: 'this is the decoder',
      name_instruction: 'please input your name',
      email_instruction: 'please input your email',
      picture_instruction: 'now Im going to take a picture ',

      instructions: 'use your arrow keys'
    }

    loadAndCompile(views+'/base.html', function(data, err){
      sendResponse(res, data, params)
    })


    })
}

var receive = function (router){
  router.post('/userDone', function (req, res){
    console.log("post",req.post)
    res.end('ok')
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


