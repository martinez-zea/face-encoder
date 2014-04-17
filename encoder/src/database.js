'use strict';

var Datastore = require('nedb'),
  utils = require('./utils'),
  logger = require('./logger')

function Database (path) {
  this.db = new Datastore({
    filename: path,
    autoload: true
  })
}

Database.prototype.insert = function(doc, callback) {
  this.db.insert(doc, function (err, newDoc) {
    if (err) {
      utils.onErr('Inserting doc into db', err)
      callback(err, null)
    } else{
      logger.log('info', 'document saved into db')
      callback(null, newDoc)
    }
  })
}


module.exports = Database
