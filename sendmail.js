var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(
    smtpTransport({
        host: 'smtp.webfaction.com',
        port: 25,
        debug:true,
        auth:{
             user: 'pathogenius_guc',
             pass: 'pathpass'
        }
    }));
    
     transporter.sendMail({
            from: 'pathogenious@pathogenious.me',
            to:'amr.m.draz@gmail.com',
          subject: 'verify pathogenious',
          text: 'hello world!'
     }, function (err, info) {
         if(err) return console.log(err);
         console.log(info)
     });
