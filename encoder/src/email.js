'use strict';
// # Mailer
// send emails with information and svg to the interactors
var nodemailer = require('nodemailer'),
  local_config = require('./local_config'),
  chalk = require('chalk'),
  i18n = require('i18next'),
  utils = require('./utils'),
  Db = require('./database')

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
  });
}

Mailer.prototype.sendEmails = function(){
  var db = new Db()
  db.find(function(users){
    _.forEach(users, function(item){
      this.compile(item)
    })
  })
}}

// TODO: adjust to stract data from db
Mailer.prototype.compile = function(user) {
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

   //compile and send the email
   loadAndCompile(views+'/email.html', function (data, err){
     if (err) {
       utils.onErr('compiling email', err)
     } else{
       this.send(user.email, data(params), user.face, user.svg)
     }
   })
}

Mailer.prototype.send = function(to, body, img_path, portrait_path) {
  // envelope
  // TODO: review attachments
  var mailOptions = {
    from: local_config.EMAIL_FROM,
    subject: i18n.t('email_subject'),
    to: to,
    html: body,
    //forceEmbeddedImages: true,
    //filename: 'portrait.png',
    filePath: img_path,
    cid:'portrait@decod.er'
  }

  // send mail with defined transport object
  this.transport.sendMail(mailOptions, function (err, response){
      if(err){
          utils.onErr('sending mail', err)
      }else{
        console.log( chalk.gray('Message sent: ' + response.message) )
      }
      // shutdown the connection
      this.transport.close()
  })
}

module.exports.Mailer = Mailer
