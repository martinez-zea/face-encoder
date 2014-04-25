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

Database.prototype.find = function(callback){
 this.db.find({status:'wating'}, function (err,docs){
  if (err) {
    utils.onErr('query db', err)
  } else{
    callback(docs)
  }
 })
}

Database.prototype.update = function(id, callback) {
  this.db.update({_id: id}, {$set:{status:'sent'}}, function (err, doc){
    if (err){
      utils.onErr('updating doc', err)
      callback(err, null)
    } else {
      callback(null, doc)
    }
  })
}

module.exports = Database
