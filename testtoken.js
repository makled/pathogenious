var mongoose = require('mongoose');
mongoose.connect("mongodb://lordvoldmort:05051989@ds055699.mongolab.com:55699/masters", function () {
    console.log('connected db');
});
var Token=require("./models/token");
var User=require("./models/user");
var u = new User( {
    "displayName": "test user",
    "email": "test.user@student.guc.edu.eg",
    "id": "28-1234",
    "password": "1234",
    "totalScore": 0,
    "correctScenarios": 0,
    "answeredQuestions": 0,
    "correctQuestions": 0,
    "answeredQuestionsCardio": 0,
    "correctQuestionsCardio": 0,
    "answeredScenariosIds": [],
});
User.create(u,function(err,sc){
    if(err) console.log("error creating user");
    var tok=new Token({
    user:u._id
  } );
  Token.create(tok,function(err,t){
      if(err)return console.log("err creating token");
      console.log("token created");
  });
});
/*u.save(function(err){
   if(err) return console.log("err saving user");
   var tok=new Token({
    user:u.id
  } );
tok.save(function(err)
{
    if(err) return console.log("err saving token");
    console.log("token created");
})
});*/

