var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport({
   service: 'Gmail',
    auth: {
        user: 'pathogenious@gmail.com',
        pass: 'ma05051989'
    }
    });
    
     transporter.sendMail({
            from: 'pathogenious@gmail.com',
            to:'lordvoldmort89@gmail.com',
          subject: 'verify pathogenious',
          text: 'hello world!'
     }, function (err, info) {
         if(err) return console.log(err);
         console.log(info)
     });
