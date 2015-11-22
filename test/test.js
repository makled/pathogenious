var mongoose = require('mongoose');
var User = require("../models/user.js");
var Session=require("..//models/session.js");
mongoose.connect("mongodb://lordvoldmort:05051989@ds055699.mongolab.com:55699/masters");

var db = mongoose.connection;
db.on('error', function callback() {
    console.log("errr");
});
db.once('open', function callback() {
Session.update({},{$set:{}},function(err,res){
    if(err) return console.log("err");
    console.log("update successful");
})
});


