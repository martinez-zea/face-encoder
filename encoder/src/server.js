var http = require('http'),
  Router = require('node-simple-router'),
  chalk = require('chalk'),
  config = require('./config')


var initiate = function (){
  var static_files = process.cwd() + '/static'

  // instantiate the router
  var router = new Router({
    logging: true,
    log: console.log,
    static_route: static_files,
  })

  // routes
  router.get("/", function (req, res) {
    res.end("Hello, World!")
  })

  // start the server
  var server = http.createServer(router);
  server.listen(config.PORT);
}

module.exports.initiate = initiate
