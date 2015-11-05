//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var express = require('express');
var mongoose = require('mongoose');
mongoose.connect("mongodb://lordvoldmort:05051989@ds055699.mongolab.com:55699/masters", function () {
    console.log('connected db')
});
var gamified=[];
for(var i = 0 ; i < 20 ; i++)
{
    gamified.push(true);
}
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(
    smtpTransport({
        host:"smtp.webfaction.com",
        debug:true,
        port:25,
        auth:{
             user: 'pathogenius_guc',
             pass: 'pathpass'
        }
    }));
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

var Scenario = require("./models/scenario");
var User = require("./models/user");
var Token = require("./models/token");
var Session=require("./models/session");

router.use(express.static(path.resolve(__dirname, 'client')));

router.get('/verify/:id', function (req, res, err) {
   Token.findById(req.params.id, function (err, token) {
       if (err) return console.log(err);
       
       if(token) {
           
           User.findById(token.user,function(err, u) {
              if(err) return console.log(err);
              u.verified=true;
              u.save(function(err){
                  if(err) return console.log(err);
                   res.redirect('https://masters-new-lordvoldmort.c9.io/reg_complete.html');
              });
            
           });
       } else {
           res.send('you need to register first !!');
       }
   });
});
var sockets = [];

io.on('connection', function (socket) {
    console.log("connected", socket.id);

    sockets.push(socket);

    socket.on('disconnect', function () {
    /*    User.find({"socketId":socket.id},function(err,users){
            if(err) return console.log("error retrieving user after disconnect ",err);
            
            if(users.length>0)
            {
                console.log("the user after disconnect "+JSON.stringify(users[0]));
                Session.find({"user":users[0]._id},function(err,sessions){
                    if(err) return console.log("error getting sessions after disconnect ",err);
                    sessions[0].logout=Date.now();
                    var dur=(sessions[0].logout-sessions[0].login)/1000;
                    sessions[0].durationHours=Math.floor(dur/3600);
                    dur=dur%3600;
                    sessions[0].durationMinutes=Math.floor(dur/60);
                    sessions[0].durationSeconds=dur%60;
                    sessions[0].save(function(err){
                        if(err) return console.log("error saving session after disconnect ",err);
                    });
                });
            }
            else
            console.log("no users found after disconnect");
        });*/
      console.log("disconnected", socket.id);
    });
    
    socket.on('client.login.gamified', function (info) {
        Session.find({"user":info.id},function(err,res){
            if(err) return console.log("error finding sessions after login ",err);
            if(res.length==0){
               var s={
                   user:info.id,
                   login:[Date.now()],
                   scoreIn:[info.score],
                   gamified:true
               };
               Session.create(s,function(err, res) {
                   if(err) return console.log("error creating session for new login ",err);
                   console.log("session created for new user");
               });
            }
            else
            {
                res[0].login.push(Date.now());
                res[0].scoreIn.push(info.score);
                res[0].save(function(err){
                    if(err) return console.log("error saving session after login ",err);
                    console.log("session login updated for existing user ");
                });
            }
        })
   /*   User.findById(user._id,function(err,user){
            if(err) return console.log(err);
            if(user) {
                var s={
                    user:id,
                    login:Date.now()
                }
                Session.create(s,function(err,sess){
                    if(err) return console.log("session creation error ",err);
                    user.socketId=socket.id;
                    user.save(function(err){
                        if(err) return console.log("user saving error ",err);
                        socket.emit("successful.login", user);
                    });
                });
            }
        });*/
      
    });
    
    socket.on('client.logout.gamified',function(info){
        console.log("entering session update.....");
        Session.find({"user":info.id},function(err,res){
            if(err) return console.log("error finding session after logout ",err);
            if(res.length==0)
            console.log("no user found after logout");
            else
            {
                res[0].logout.push(Date.now());
                var dur=(res[0].logout[res[0].logout.length-1]-res[0].login[res[0].logout.length-1])/1000;
                res[0].durationHours.push(Math.floor(dur/3600));
                dur=dur%3600;
                res[0].durationMinutes.push(Math.floor(dur/60));
                res[0].durationSeconds.push(dur%60);
                res[0].scoreOut.push(info.score);
                res[0].scores.push(info.score-res[0].scoreIn[res[0].scoreIn.length-1]);
                res[0].save(function(err){
                    if(err) return console.log("error saving session after logout ",err)
                    console.log("user session updated after logout");
                })
            }
        })
    });
    
    socket.on('client.login.ung', function (id) {
        Session.find({"user":id},function(err,res){
            if(err) return console.log("error finding sessions after login ",err);
            if(res.length==0){
               var s={
                   user:id,
                   login:[Date.now()],
                   gamified:false
               };
               Session.create(s,function(err, res) {
                   if(err) return console.log("error creating session for new login ",err);
                   console.log("session created for new ung user");
               });
            }
            else
            {
                res[0].login.push(Date.now());
                res[0].save(function(err){
                    if(err) return console.log("error saving session after login ",err);
                    console.log("session login updated for existing user ");
                });
            }
        })
   /*   User.findById(user._id,function(err,user){
            if(err) return console.log(err);
            if(user) {
                var s={
                    user:id,
                    login:Date.now()
                }
                Session.create(s,function(err,sess){
                    if(err) return console.log("session creation error ",err);
                    user.socketId=socket.id;
                    user.save(function(err){
                        if(err) return console.log("user saving error ",err);
                        socket.emit("successful.login", user);
                    });
                });
            }
        });*/
      
    });
    
    socket.on('client.logout.ung',function(id){
        console.log("entering session update ung.....");
        Session.find({"user":id},function(err,res){
            if(err) return console.log("error finding session after logout ",err);
            if(res.length==0)
            console.log("no user found after logout");
            else
            {
                res[0].logout.push(Date.now());
                var dur=(res[0].logout[res[0].logout.length-1]-res[0].login[res[0].logout.length-1])/1000;
                res[0].durationHours.push(Math.floor(dur/3600));
                dur=dur%3600;
                res[0].durationMinutes.push(Math.floor(dur/60));
                res[0].durationSeconds.push(dur%60);
                res[0].save(function(err){
                    if(err) return console.log("error saving session after logout ",err)
                    console.log("ung user session updated after logout");
                })
            }
        })
    });

    socket.on('scenario.create', function (scenario) {
      
      Scenario.create(scenario, function(err, scenario) {
          
          if (err) return console.log(err);
         socket.emit("scenario.created", scenario);
         console.log("scenario created");
      });
    });
    
    
    socket.on('search',function(obj){
        var query={};
        if(obj.ini)
        query["ini-text"] = obj.ini;
        if(obj.topic)
        {
           
        query["topic"]=obj.topic;
        }
        if(obj.lvl)
        {
            
        query["lvl"]=obj.lvl;
        }
        
  // Scenario.find({$or : [{'ini.text': obj.ini}, {'topic': obj.topic}, {'lvl':obj.lvl}]},function(err,res){
  Scenario.find(query,function(err,res){
       if(err) return console.log("error here !!! "+err);
       
       console.log("obj received res has length of "+res.length)
        socket.emit("receive",res);
     });
    
    });
    
    socket.on('request.update',function(request){
        Scenario.findById(request.id, function (err, scenario) {
  if (err) return console.log(err);
  
  scenario.topic=request.scenario.topic;
  scenario.lvl=request.scenario.lvl;
  scenario.ini=request.scenario.ini;
  scenario.rooms=request.scenario.rooms;
  scenario.end=request.scenario.end;
  scenario.save(function (err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(scenario.rooms));
    socket.emit('update.done');
  });
});
    });
    
    socket.on('request.remove',function(id){
      Scenario.remove({_id:id},function(err){
         if(err) return console.log(err);
         console.log("scenario with id :"+id+" has been removed");
         socket.emit('remove.done');
      });
    });
    
    socket.on('get.possible.scenario.gamified',function(info){
        var random=Math.ceil(Math.random()*100);
        var lv=0;
         if(info.level==1)
        {
            if(random>=0 && random<=70)
            lv=1;
            else if(random>70 &&random<=90)
            lv=2;
            else
            lv=3;
        }
        else if(info.level==2)
        {
            if(random>=0 && random<=70)
            lv=3;
    else
            lv=2;
        }
        else if(info.level==3)
        {
            if(random>=0 && random<=90)
            lv=3;
            else
            lv=2;
        }
        Scenario.find({'lvl':lv,'topic':info.topic},function(err,res){
            if(err) return console.log(err);
            User.find({'_id':info.id},function(err, users) {
                if(err) return console.log("error getting user to send scenarios ",err);
                var ids;
                if(info.topic=="Genetics")
                ids=users[0].answeredScenariosIdsGenetics;
                else if(info.topic=="Cardiovascular")
                ids=users[0].answeredScenariosIdsCardio;
                else if(info.topic=="CNS")
                ids=users[0].answeredScenariosIdsCNS;
                else if(info.topic=="BloodCells")
                ids=users[0].answeredScenariosIdsBloodCells;
                var scen;
                 var repeated;
                // var toGet = Math.random() * (res.length);
                  // console.log("topic is "+info.topic);
              //  var scen=res[Math.floor(toGet)];
              if(info.level>1){
                // var b=  checkFull(ids,res,lv);
                // if(b==false){
                //     console.log("entered finding step 1");
                //     var found=false ;
                //     var rando=0;
                //     for(var i=0 ; i < res.length && found==false ; i++){
                //          rando = Math.floor(Math.random() * (res.length));
                //          if(ids.indexOf(res[rando])==-1)
                //          found=true;
                        
                //     }
                //     scen=res[rando];
                //     repeated=ids.indexOf(scen._id)>-1?true:false;
                //     console.log("scenario from step 1 is ",typeof scen ==="undefined");
                // }
                // else{
                //     var lv2;
                //     if(lv==2)
                //     lv2=3;
                //     else
                //     lv2=2;
                //     Scenario.find({"lvl":lv2},function(err, res2) {
                //         if(err) return console.log("error getting scenarios after full randomization ",err);
                //         var b2=checkFull(ids,res2,lv2);
                //         if(b2==false)
                //         {
                //             console.log("entered step 2");
                //         var found2=false ;
                //     var rando2=0;
                //     for(var i=0 ; i < res2.length && found2==false ; i++){
                //          rando2 = Math.floor(Math.random() * (res2.length));
                //          if(ids.indexOf(res2[rando2])==-1)
                //          found2=true;
                //     }
                //     scen=res2[rando2];
                //     repeated=ids.indexOf(scen._id)>-1?true:false;
                //     console.log("scenario from step 2 is ",typeof scen ==="undefined");
                //     }
                //     else
                //     {
                //         console.log("entered step 3");
                //       Scenario.find({"lvl":1},function(err,res3){
                //           if(err) return console.log("error getting scenarions lvl 1 after randomization ",err);
                //             var found3=false ;
                //     var rando3=0;
                //     for(var i=0 ; i < res3.length && found3==false ; i++){
                //          rando3 = Math.floor(Math.random() * (res3.length));
                //          if(ids.indexOf(res3[rando3])==-1)
                //          found3=true;
                         
                //     }
                //     scen=res3[rando3];
                //     repeated=ids.indexOf(scen._id)>-1?true:false;
                //     console.log("scenario from step 3 is ",typeof scen === "undefined");
                //       }) 
                //     }
                //     })
                // }
                Scenario.find({"topic":info.topic},function(err,result){
                    if(err) return console.log("error getting scenarios for high lvl gamified ",err);
                    var found3=false;
                    var rando3=0;
                     for(var i=0 ; i < result.length && found3==false ; i++){
                          rando3 = Math.floor(Math.random() * (result.length));
                         if(ids.indexOf(result[rando3])==-1)
                         found3=true;
                         
                     }
                     scen=result[rando3];
                     repeated=ids.indexOf(scen._id)>-1?true:false;
                     console.log("scenario from big step is ",typeof scen === "undefined");
                })
              }
              else{
                  console.log("entered base step");
                   var toGet = Math.random() * (res.length);
                   console.log("topic is "+info.topic);
                 scen=res[Math.floor(toGet)];
                 repeated=ids.indexOf(scen._id)>-1?true:false;
                 console.log("scenario from base step is ",typeof scen ==="undefined");
              }
              
               if(!scen)
               {
                  var toGet = Math.random() * (res.length);
                   console.log("topic is "+info.topic);
                 scen=res[Math.floor(toGet)];
                 repeated=ids.indexOf(scen._id)>-1?true:false;
                 console.log("scenario from fail step is ",typeof scen === "undefined"); 
               }
               
                var send={
                    scenario:scen,
                    repeated:repeated
                };
                console.log("here is the final send ",send);
                socket.emit("receive.possible.scenario.gamified",send);
            });
            
        });
    });
    
      socket.on('request.registration', function (user) {
          
           User.find({'userName':user.userName},function(err,res){
            if(err) {return console.log(err);}
            if(res.length>0) {
            socket.emit("registration.duplicate.email");
            }
            else
            {
                user.gamified=gamified[user.tutorial-1];
                gamified[user.tutorial-1]=!gamified[user.tutorial-1];
             User.create(user, function(err, u) {
                  if (err)  console.log("ramy",err);
                  var token=new Token({
                      user:u._id
                  });
                  
                  
                  Token.create(token,function(error,t){
                      transporter.sendMail({
                    from: 'pathogenious@pathogenious.com',
                    to:u.userName+"@guc.edu.eg",
                  subject: 'verify pathogenious',
                  text: 'welcome '+user.displayName+' !!\n to verify your mail and unlock your account just click the following link : \n https://masters-new-lordvoldmort.c9.io/verify/'+t._id
             }, function (err, info) {
                 if(err) return console.log(err);
             });
                 socket.emit("registration.complete");
                 console.log("user regisstered"); 
                  });
              });
            }
        });
      
     
    });
    
    socket.on('request.login',function(info){
        console.log("request login received");
        User.find({'userName':info.userName , 'password':info.password},function(err,res){
            if(err) return console.log(err);
            else if(res.length==0)
            socket.emit("invalid.login.info");
            else if(res[0].verified==false)
            socket.emit('not.verified.user');
            else
            {
               
            socket.emit("successful.login",res[0]);
            }
        });
    });
    
    socket.on("save-for-later",function(info){
        User.update({"_id":info.user},{$set:{"currectScenarioId":info.scenarioId,"currentScenarioScore":info.score,"currentScenarioTopic":info.topic,"currentScenarioPosition":info.position}},function(err,user){
            if(err) return console.log("error updating user for later use ",err);
            console.log("updated user for later use for topic ",info.topic);
        });
    });
    
    socket.on("confirm-not-done",function(info){
        User.find({"_id":info.user},function(err,users){
            if(err) return console.log("error getting user for confirmation ",err);
            var size;
            if(info.topic=="Genetics")
            size=(!users[0].answeredScenariosIdsGenetics)?0:users[0].answeredScenariosIdsGenetics.length;
            else if(info.topic=="Cardiovascular")
            size=(!users[0].answeredScenariosIdsCardio)?0:users[0].answeredScenariosIdsCardio.length;
            else if(info.topic=="CNS")
            size=(!users[0].answeredScenariosIdsCNS)?0:users[0].answeredScenariosIdsCNS.length;
            else if(info.topic=="BloodCells")
            size=(!users[0].answeredScenariosIdsBloodCells)?0:users[0].answeredScenariosIdsBloodCells.length;
            Scenario.find({"topic":info.topic},function(err,res){
                if(err) return console.log("error getting scenarios for confirmation ",err)
                 if(res.length==0)
                socket.emit("empty");
                 else if(users[0].currentScenarioScore!=-1&&users[0].currentScenarioTopic!=info.topic)
                {
                  //  console.log(users[0].currentScenarioTopic);
                    var send={
                        scenarioId:res[0].currentScenarioId,
                        scenarioScore:res[0].currentScenarioScore,
                        scenarioPosition:res[0].currentScenarioPosition,
                        scenarioTopic:res[0].currentScenarioTopic,
                        clickedTopic:info.topic
                    }
                    console.log("topic chosen was "+info.topic+" but unfinished topic was "+users[0].currentScenarioTopic)
               // socket.emit("unfinished.scenario.different.topic",send);
               socket.emit("continue-to-topic",info.topic);
                }
                 else if(users[0].currentScenarioScore!=-1&&users[0].currentScenarioTopic==info.topic)
                {
                  //  console.log(users[0].currentScenarioTopic);
                    var send={
                        scenarioId:users[0].currentScenarioId,
                        scenarioScore:users[0].currentScenarioScore,
                        scenarioPosition:users[0].currentScenarioPosition,
                        scenarioTopic:users[0].currentScenarioTopic,
                        clickedTopic:info.topic
                    }
                    console.log("topic chosen was "+info.topic+" but unfinished topic was "+users[0].currentScenarioTopic)
                //socket.emit("unfinished.scenario.same.topic",send);
                socket.emit("continue-to-topic",info.topic);
                }
              else if(res.length==size&&res.length!=0)
                socket.emit("done",info.topic);
                else
                {
                    console.log("proceeding to topic "+info.topic);
                socket.emit("continue-to-topic",info.topic);
                }
            })
        })
        
    });
    
    socket.on("get.this.scenario",function(information){
        Scenario.find({"_id":information.scenario},function(err,scenarios){
            if(err) return console.log("error getting scenario for specific one ",err);
            User.find({"_id":information.user},function(err, users) {
                if(err) return console.log(err);
                var array;
                console.log("here is the information ",information);
                //console.log("getting array of "+informartion.topic);
                if(information.topic=="Genetics")
                array=users[0].answeredScenariosIdsGenetics;
                else if(information.topic=="Cardiovascular")
                array=users[0].answeredScenariosIdsCardio;
                else if(information.topic=="CNS")
                array=users[0].answeredScenariosIdsCNS;
                else if(information.topic=="BloodCells")
                array=users[0].answeredScenariosIdsBloodCells;
                console.log("and the array is ",array);
                var send={
                    scenario:scenarios[0],
                    repeated:array.indexOf(information.scenario)>-1?true:false
                }
                socket.emit("receive.this.scenario",send);
            })
        })
    });
    
    socket.on("update.player",function(updateInfo){
        User.find({"_id":updateInfo.user},function(err, users) {
            if(err) console.log("error getting user to update ",err);
           
            var arr;
             var slevel=updateInfo.specificLevel;
            var toSet;
            if(updateInfo.topic=="Genetics")
            {
                arr=users[0].answeredScenariosIdsGenetics;
                arr.push(updateInfo.scenario);
               
                if(slevel==1&& users[0].geneticsScore+updateInfo.score>600)
                slevel=2;
                else if(slevel==2 &&users[0].geneticsScore+updateInfo.score>1400)
                slevel=3;
                toSet={
                    answeredScenariosIdsGenetics:arr,
                    geneticsScore:users[0].geneticsScore+updateInfo.score,
                    answeredQuestionsGenetics:users[0].answeredQuestionsGenetics+updateInfo.answered,
                    correctQuestionsGenetics:users[0].correctQuestionsGenetics+updateInfo.correct,
                    correctScenariosGenetics:updateInfo.repeated==false?users[0].correctScenariosGenetics+1:users[0].correctScenariosGenetics,
                    geneticsLevel:slevel
                };
            }
            else  if(updateInfo.topic=="Cardiovascular")
            {
                 arr=users[0].answeredScenariosIdsCardio;
                arr.push(updateInfo.scenario);
                if(slevel==1&& users[0].cardioScore+updateInfo.score>600)
                slevel=2;
                else if(slevel==2 &&users[0].cardioScore+updateInfo.score>1400)
                slevel=3;
                toSet={
                    answeredScenariosIdsCardio:arr,
                    cardioScore:users[0].cardioScore+updateInfo.score,
                    answeredQuestionsCardio:users[0].answeredQuestionsCardio+updateInfo.answered,
                    correctQuestionsCardio:users[0].correctQuestionsCardio+updateInfo.correct,
                    correctScenariosCardio:updateInfo.repeated==false?users[0].correctScenariosCardio+1:users[0].correctScenariosCardio,
                    cardioLevel:slevel
                };
            }
            else  if(updateInfo.topic=="CNS")
            {
                 arr=users[0].answeredScenariosIdsCNS;
                arr.push(updateInfo.scenario);
                if(slevel==1&& users[0].cnsScore+updateInfo.score>600)
                slevel=2;
                else if(slevel==2 &&users[0].cnsScore+updateInfo.score>1400)
                slevel=3;
                toSet={
                    answeredScenariosIdsCNS:arr,
                   cnsScore:users[0].cnsScore+updateInfo.score,
                    answeredQuestionCNS:users[0].answeredQuestionsCNS+updateInfo.answered,
                    correctQuestionsCNS:users[0].correctQuestionsCNS+updateInfo.correct,
                    correctScenariosCNS:updateInfo.repeated==false?users[0].correctScenariosCNS+1:users[0].correctScenariosCNS,
                    cnsLevel:slevel
                };
            }
            else  if(updateInfo.topic=="BloodCells")
            {
                 arr=users[0].answeredScenariosIdsBloodCells;
                arr.push(updateInfo.scenario);
                if(slevel==1&& users[0].bloodCellsScore+updateInfo.score>600)
                slevel=2;
                else if(slevel==2 &&users[0].bloodCellsScore+updateInfo.score>1400)
                slevel=3;
                toSet={
                    answeredScenariosIdsBloodCells:arr,
                    bloodCellsScore:users[0].bloodCellsScore+updateInfo.score,
                    answeredQuestionsBloodCells:users[0].answeredQuestionsBloodCells+updateInfo.answered,
                    correctQuestionsBloodCells:users[0].correctQuestionsBloodCells+updateInfo.correct,
                    correctScenariosBloodCells:updateInfo.repeated==false?users[0].correctScenariosBloodCells+1:users[0].correctScenariosBloodCells,
                    bloodCellsLevel:slevel
                };
            }
            
            var bigLevel=updateInfo.overallLevel;
            var bigScore=users[0].totalScore+updateInfo.score;
            if(bigLevel==1 && bigScore>3000)
            bigLevel=2;
            else if (bigLevel==2 && bigScore>5000)
            bigLevel=3
            var bigAnswered=users[0].answeredQuestions+updateInfo.answered;
            var bigCorrect=users[0].correctQuestions+updateInfo.correct;
            toSet.totalScore=bigScore;
            toSet.level=bigLevel;
            toSet.answeredQuestions=bigAnswered;
            toSet.correctQuestions=bigCorrect;
            console.log("here is update info "+JSON.stringify(updateInfo));
            console.log("here is the toSet "+JSON.stringify(toSet));
            User.update({"_id":updateInfo.user},{$set:toSet},function(err,user){
                if(err) return console.log("err updating user after finish ",err);
                
                updateRank(updateInfo.user);
                User.find({"_id":updateInfo.user},function(err,users){
                    if(err) return console.log("error getting user after rank update ",err);
                    socket.emit("update.finished",users[0]);
                })
            })
        })
    });
    
    socket.on("get.possible.scenario.ung",function(topic){
        Scenario.find({"topic":topic},function(err, scenarios) {
            if(err) return console.log("error getting ung scenarios ",err);
            var rand= Math.floor(Math.random()*scenarios.length);
            socket.emit("receive.possible.scenario.ung",scenarios[rand]);
        })
    });
    
    socket.on("update.player.ung",function(info) {
        console.log("info received from update ung player ",info);
       User.find({"_id":info.user},function(err, users) {
           if(err) console.log("error getting player to update non gamified ",err)
           var toSet;
           if(info.topic=="Genetics"){
               toSet={
                   correctScenariosGenetics:users[0].correctScenariosGenetics+1
               }
           }
           else   if(info.topic=="Cardiovascular"){
               toSet={
                   correctScenariosCardio:users[0].correctScenariosCardio+1
               }
           }
           else   if(info.topic=="CNS"){
               toSet={
                   correctScenariosCNS:users[0].correctScenariosCNS+1
               }
           }
           else   if(info.topic=="BloodCells"){
               toSet={
                   correctScenariosGenetics:users[0].correctScenariosGenetics+1
               }
           }
           console.log("here is the toSet of the ung player ",toSet);
           console.log("here is the id of the ung player to send back ",users[0]._id);
          User.update({"_id":users[0]._id},{$set:toSet},function(err,response){
              if(err) return console.log("error updating ungamified user ",err);
              User.find({"_id":users[0]._id},function(err,users){
                  if(err) console.log("error finding ung user for the last time after update ",err);
                  console.log("here is the player to send back to the ung player ",users[0]);
                  socket.emit("update.finished.ung",users[0]);
              })
          })
       })
    });
    
    socket.on("update.rank",function(id){
        updateRank(id);
        User.find({"_id":id},function(err,res){
            if(err) console.log("error finding user after update rank ",err);
            socket.emit("rank.updated",res[0]);
        })
    })
});


function updateRank(id)
{
    User.find().sort({totalScore:-1}).exec(function(err,res){
        if(err) return console.log("error fetching users for ranking ",err)
        var currentScore=res[0].totalScore;
        var r=0;
       for(var i = 0 ; res[i]._id!=id; i++){
           if(res[i].rank!=-1 && res[i].totalScore!=currentScore)
           {
            currentScore=res[i].totalScore ;
            r++;
           }
           
       }
       r++;
       User.update({"_id":id},{$set:{rank:r}},function(err,response){
           if(err) return console.log("error updating player rank ",err)
           console.log("user rank updated to rank "+r);
       })
    })
}

function checkFull(ids,res,level){
    var count=0;
    for(var i = 0 ; i < res.length; i++){
        if(ids.indexOf(res[i]._id)>-1)
        count++;
    }
    return count==res.length;
}
server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
