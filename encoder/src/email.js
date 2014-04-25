'use strict';
// # Mailer
// send emails with information and svg to the interactors
var nodemailer = require('nodemailer'),
  local_config = require('./local_config'),
  _ = require('lodash'),
  logger = require('./logger'),
  i18n = require('i18next'),
  utils = require('./utils'),
  Db = require('./database'),
  Template = require('./template')

// configuration for 18n
i18n.init({
  //default language from config
  lng: local_config.LANGUAGE,
  ns: 'translation',
  resGetPath: __dirname + '/locales/__ns__-__lng__.json'
})

function Mailer(){
  // # Email configuration
  // basic settings for a SMTP server
  this.transport = nodemailer.createTransport('SMTP', {
      host: local_config.EMAIL_HOST,
      auth: {
          user: local_config.EMAIL_USER,
          pass: local_config.EMAIL_PASS
      }
  })

  this.db = new Db(__dirname+'/static/users.db')
}

Mailer.prototype.sendEmails = function(){
  var self = this

  this.db.find(function(users){
    logger.log('info', 'sending ' + users.length + ' emails')
    _.forEach(users, function(item){
      self.compile(item)
    })
  })
}

// TODO: adjust to stract data from db
Mailer.prototype.compile = function(user) {
  var self = this
  // data for the template
  var params = {
    username: user.username,
    email: user.email,
    paths: {
      png: user.face,
      svg: user.svg
    },
    hello: i18n.t('email_hello'),
    body: i18n.t('email_body'),
    information: i18n.t('email_information'),
    bye: i18n.t('email_bye')
  }

  var template = new Template(__dirname +'/views/email.html')
  template.compile(function (err, data){
     if (err) {
       utils.onErr('compiling email', err)
     } else{
      self.send(user.email, data(params), user.face, user.svg, user._id)
     }
   })
}

Mailer.prototype.send = function(to, body, img_path, portrait_path, id) {
  var self = this
  // envelope
  // TODO: review attachments
  var mailOptions = {
    from: local_config.EMAIL_FROM,
    subject: i18n.t('email_subject'),
    to: to,
    html: body,
    attachments: [
      {
        filename: 'portrait.png',
        filePath: __dirname+'/static/img/'+img_path,
        cid:'portrait@decod.er'
      },
      {
        filename: 'portrait.svg',
        filePath: __dirname+'/static/svg/'+portrait_path,
        cid:'svg@decod.er'
      }
      ]
    }

  // send mail with defined transport object
  this.transport.sendMail(mailOptions, function (err, response){
      if(err){
          utils.onErr('sending mail', err)
      }else{
        logger.log('info', 'Message sent: ' + response.message)
        // shutdown the connection
        //self.transport.close()

        self.db.update(id, function (err){
          if (err) {
            utils.onErr('updating', err)
          } else{
            logger.log('info', 'doc updated')
          }
        })
      }
  })
}

module.exports = Mailer
