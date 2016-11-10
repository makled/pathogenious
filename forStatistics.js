var Stats = require("./models/stats");
var mongoose = require('mongoose');
mongoose.connect("mongodb://lordvoldmort:05051989@ds023118.mlab.com:23118/recovery", function() {
    console.log('connected db')
   
});
var fs = require('fs');
Stats.find({},function(err,stats){
    if(err) return console.log("error getting stats records "+err);
    for(var i = 0 ; i <stats.length ; i ++)
    {
     
        var app = [
            stats[i].id,
            stats[i].name,
            stats[i].registered,
            stats[i].gamified,
            stats[i].score,
            stats[i].totalDuration,
            stats[i].durationBeforeQuiz2,
            stats[i].durationBeforeQuiz2day,
            stats[i].durationBeforeQuiz3,
            stats[i].durationBeforeQuiz3day,
            stats[i].durationBeforeFinal,
             +stats[i].durationBeforeFinalday,
             stats[i].quiz2Grade,
             stats[i].quiz3Grade,
             stats[i].finalGrade,
             stats[i].group].join(',')+"\n";
        fs.appendFileSync('records_nocut_withgroups.csv', app);
    }
});
