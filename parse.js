var Stats = require("./models/stats");
var User=require("./models/user");
var Converter = require("csvtojson").Converter;
var Session = require("./models/session");
var mongoose = require('mongoose');
mongoose.connect("mongodb://lordvoldmort:05051989@ds023118.mlab.com:23118/recovery", function() {
    console.log('connected db')
   
});
var finals={};
var secondConverter= new Converter({});
secondConverter.fromFile("./results/Results final exam.csv",function(err,res){
     if(err) return console.log("error parsing the finals file "+err);
     for(var i = 0 ; i < res.length; i ++)
     {
         finals[setCharAt(res[i].ApplicantID+"",2,'-')] = res[i];
     }
     console.log("parsed finals files successfully");
      parseFile( "./results/Results quiz PL1.csv");
      console.log("parsed file successfully");
});

 

    function parseFile(path)
    {
var converter = new Converter({});
converter.fromFile(path,function(err,result){
    var cache={};
    if(err) return console.log("error parsing the file in the path "+path+" "+err);
// var secondConverter= new Converter({});
// secondConverter.fromFile("./results/Results final exam.csv",function(err,finals){
//      if(err) return console.log("error parsing the finals file "+err);
     for(var i = 0 ; i < result.length ; i++)
     {
        // var n=result[i].full_name;
        var idno= result[i].app_no;
        cache[idno]={};
        cache[idno].n=result[i].full_name;
        cache[idno].q2grade=result[i].Quiz2Pathophysiology;
        cache[idno].q3grade=result[i].Quiz3;
        // for(var j = 0 ; j <finals.length ; j ++)
        // {
        //      var correctId=;
        //      if(correctId==idno)
        //      {
                
        //       // finalgrade=parseInt(""+finals[j].Overall.substr(0,3));
        //      finalgrade=parseInt(finals[j].Overall);
        //          break;
        //      }
        // }
        
        calculateDuarations(idno, function (err,duration , idno) {
                 if(!err && duration)
                 {
                     var s = {
                        id:duration.id,
                        name:cache[idno].n,
                        registered:duration.registered,
                        gamified:duration.gamified,
                        score:duration.score,
                        totalDuration:duration.totalDuration,
                        durationBeforeQuiz2:duration.durationBeforeQuiz2,
                        durationBeforeQuiz2day:duration.durationBeforeQuiz2day,
                        durationBeforeQuiz3:duration.durationBeforeQuiz3,
                        durationBeforeQuiz3day:duration.durationBeforeQuiz3day,
                        durationBeforeFinal:duration.durationBeforeFinal,
                        durationBeforeFinalday:duration.durationBeforeFinalday,
                        quiz2Grade:cache[idno].q2grade,
                        quiz3Grade:cache[idno].q3grade,
                        finalGrade: finals[idno]?parseInt(finals[idno].Overall):0,
                        group:duration.group
                     }
                     Stats.create(s,function(err,res){
                         if(err) return console.log("error creating a record for the id "+duration.id +" "+err);
                     })
                 }
            });
     }



});
}
function calculateDuarations(app_no, cb){
    User.$where('this.id==="'+app_no+'" || this.id==="'+ramyFixId(app_no)+'"').exec(function(err,users){
        if(err) { 
            console.log("error getting user to calculate duration "+err);
          return  cb(err);
        }
        if(users.length==0)
        {
        console.log("no users found for id "+app_no);
        var duration = {
                    id:app_no,
                    registered:false,
                    totalDuration:0,
                    durationBeforeQuiz2:0,
                    durationBeforeQuiz2day:0,
                    durationBeforeQuiz3:0,
                    durationBeforeQuiz3day:0,
                    durationBeforeFinal:0,
                    durationBeforeFinalday:0,
                    gamified:false,
                    score:0,
                    group:0
                };
               return cb(null,duration, app_no);

        }
        var gam=users[0].gamified;
        var score=users[0].totalScore;
            var id= users[0]._id;
            Session.find({"user":id},function(err,sessions){
                if(err) return console.log("error getting session to calculate duration "+err);
                if(sessions.length==0)
                {
                console.log("no sessions found for user id "+app_no);
                var duration = {
                    id:app_no,
                    registered:true,
                    totalDuration:0,
                    durationBeforeQuiz2:0,
                    durationBeforeQuiz2day:0,
                    durationBeforeQuiz3:0,
                    durationBeforeQuiz3day:0,
                    durationBeforeFinal:0,
                    durationBeforeFinalday:0,
                    gamified:gam,
                    score:0,
                    group:0
                };
               return cb(null,duration, app_no);
                }
                var total=0;
                var beforeq2=0;
                var beforeq2day=0;
                var beforeq3=0;
                var beforeq3day=0;
                var beforefinal=0;
                var beforefinalday=0;
                var session=sessions[0];
                var g=0;
                if(users[0].regDate<1447192800000)
                g=1;
                else if(users[0].regDate<1448402400000)
                g=2;
                else if(users[0].regDate<1451167200000)
                g=3;
                for (var i = 0 ; i < session.logout.length; i ++)
                {
                   var sub= (session.durationSeconds[i]/60)+session.durationMinutes[i]+(session.durationHours[i]*60);
                 //   if(sub<=90){
                        total+=sub;
                    if(session.logout[i]<1447106400000)
                    {
                        beforeq2+=sub;
                    }
                    else if(session.logout[i]<1447228800000)
                    {
                        beforeq2day+=sub;
                    }
                    else if(session.logout[i]<1448316000000)
                    {
                        beforeq3+=sub;
                    }
                    else  if(session.logout[i]<1448438400000)
                    {
                        beforeq3day+=sub;
                    }
                    else  if(session.logout[i]<1451080800000)
                    {
                        beforefinal+=sub;
                    }
                    else  if(session.logout[i]<1451212200000)
                    {
                        beforefinalday+=sub;
                    }
                  //  }
                }
                var d = {
                    id:app_no,
                    registered:true,
                    totalDuration:total,
                    durationBeforeQuiz2:beforeq2,
                    durationBeforeQuiz2day:beforeq2day,
                    durationBeforeQuiz3:beforeq3,
                    durationBeforeQuiz3day:beforeq3day,
                    durationBeforeFinal:beforefinal,
                    durationBeforeFinalday:beforefinalday,
                    gamified:gam,
                    score:score,
                    group:g
                };
               return cb(null,d, app_no);
                
            })
    });
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

function ramyFixId(id)

{
  var  ids=id.split('-');
    ids[1]=parseInt(ids[1]);
   // ids[1]=ids[1]<1000 ? '0'+ids[1]:ids[1];
    return ids.join('-');
}