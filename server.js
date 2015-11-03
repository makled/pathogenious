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
    {
        service:'Gmail',
        debug:true,
        auth:{
             user: 'pathogenious@gmail.com',
             pass: 'ma05051989'
        }
    });
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
    
    socket.on('client.login', function (id) {
        Session.find({"user":id},function(err,res){
            if(err) console.log("error finding sessions after login ",err);
            if(res.length==0){
               var s={
                   user:id,
                   login:[Date.now()]
               }
               Session.create(s,function(err, res) {
                   if(err) return console.log("error creating session for new login ",err);
                   console.log("session created for new user");
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
    
    socket.on('client.logout',function(id){
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
                    console.log("user session updated after logout");
                })
            }
        })
    })

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
            lv=2;
            else if(random>70 &&random<=90)
            lv=3;
            else
            lv=1;
        }
        else if(info.level==3)
        {
            if(random>=0 && random<=70)
            lv=3;
            else if(random>70 &&random<=90)
            lv=2;
            else
            lv=1;
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
                 var toGet = Math.random() * (res.length);
                   console.log("topic is "+info.topic);
                var scen=res[Math.floor(toGet)];
                var repeated;
                if(ids.indexOf(scen._id)>-1)
                repeated=true;
                else
                repeated=false;
                var send={
                    scenario:scen,
                    repeated:repeated
                };
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
                    from: 'pathogenious@gmail.com',
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
    })
});




server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
