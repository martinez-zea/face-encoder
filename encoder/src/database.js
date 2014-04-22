'use strict';

// # Database
// interact with nedb to store the data from users

var Datastore = require('nedb'),
  utils = require('./utils'),
  logger = require('./logger')

// Create a new database to interact with
function Database (path) {
  this.db = new Datastore({
    filename: path,
    autoload: true
  })
}

// wrapper of nedb's insert methd
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

// TODO: this is a draft syntax should be reviewed
Datastore.prototype.find = function(callback){
 this.db.find({s
tatus:'wating'}, function(data){
   callback(data)
 })
}

module.exports = Database
