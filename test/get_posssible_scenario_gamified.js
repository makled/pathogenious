var mongoose = require('mongoose');
var User = require("../models/user.js");
var Token=require("../models/token.js");

var get_posssible_scenario_gamified = require('../events/scenario').get_posssible_scenario_gamified

mongoose.connect("mongodb://lordvoldmort:05051989@ds055699.mongolab.com:55699/masters");

var db = mongoose.connection;
db.on('error', function callback() {
    console.log("errr");
});
db.once('open', function callback() {
    
   var info={
        level:3,
        id:"5631f0b447b63b4304c5d265",
        topic:"Genetics"
    };
    get_posssible_scenario_gamified(info, function(out){
        console.log("we get", out)
        console.log("===============second time==================")
        console.log(get_posssible_scenario_gamified(info, function(out) {
             console.log("then we get", out)
        }))
    })
    
});


