var mongoose = require('mongoose');
var User = require("../models/user.js");
var Token=require("..//models/token.js");
mongoose.connect("mongodb://lordvoldmort:05051989@ds055699.mongolab.com:55699/masters");

var db = mongoose.connection;
db.on('error', function callback() {
    console.log("errr");
});
db.once('open', function callback() {
  Token.findById("5630dd6e2ac605384dd66a46", function (err, token) {
       if (err) return console.log(err);
       
       if(token) {
           console.log(token)
           User.findById(token.user,function(err, u) {
               console.log("user  before :", u)
              if(err) return console.log(err);
              u.set("verified",true);
              u.save(function(err,us){
                  if(err) return console.log(err);
                   console.log("user after ", us.verified)
                   User.find({_id:us._id},function(err, u) {
                       console.log("user  after again :", u.verified)
                      if(err) return console.log(err);
                   });
              });
            
           });
       } else {
          console.log('you need to register first !!');
       }
   });
});


