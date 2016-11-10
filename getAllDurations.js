var Session = require("./models/session");
var mongoose = require('mongoose');
var fs=require('fs');
mongoose.connect("mongodb://lordvoldmort:05051989@ds023118.mlab.com:23118/recovery", function() {
    console.log('connected db');
   Session.find({},function(err,sessions){
       if(err) return console.log("error getting sessions "+err);
       for(var i = 0 ; i <sessions.length ; i++)
       {
           for(var j = 0 ; j < sessions[i].durationHours.length ; j ++)
           {
               var total= (sessions[i].durationHours[j]*60)+sessions[i].durationMinutes[j]+(sessions[i].durationSeconds[j]/60)+"\n";
               if(total>60)
               {
                   console.log("duration with "+total +" for id number "+sessions[i].user+ " ,session number "+j);
               }
                fs.appendFileSync('alldurations.csv', total);
           }
       }
       console.log("done");
   });
});