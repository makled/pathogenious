var socket=io();
$("input[value='Sign up']").on('click',function(){
var valid=validateReg();
console.log(valid)

 if(valid==-100)
 swal("ERR!", "Some required fields are still empty!", "error");
 else if(valid==-200)
 swal("ERR!", "Wrong id format!", "error");
 else if(valid==-300)
 swal("ERR!", "Wrong user name format!", "error");
 else if(valid==-400)
 swal("ERR!", "the tutorial group should be from 1 to 20", "error");
else if(valid==-500)
 swal("ERR!", "The two passwords doesn't match!", "error");
 
 else if(valid==0)
 {
     var user={
    displayName:$("#usernamesignup").val(),
	userName:$("#emailsignup").val(),
	id:$("#idsignup").val(),
	tutorial:$("#tutorialsignup").val(),
	password:$("#passwordsignup").val(),
	regDate:Date.now()
     };
     console.log("user to be sent "+JSON.stringify(user));
     socket.emit("request.registration",user);
 }
});

function validateReg(){
    var dname=$("#usernamesignup").val();
    var id=$("#idsignup").val();
    var email=$("#emailsignup").val();
    var pass=$("#passwordsignup").val();
    var passconfirm=$("#passwordsignup_confirm").val();
    var tutorial=$("#tutorialsignup").val();
    console.log(isNaN(tutorial));
    var userNamePattern = new RegExp(/[a-z-]+\.[a-z-]+/);
    var idPattern=new RegExp(/\d{1,2}-\d{3,7}/);
    
    if(dname=="" || id=="" || email=="" || pass=="" || passconfirm=="" )
    return -100;
    else if(!idPattern.test(id))
    return -200;
    else if(!userNamePattern.test(email))
    return -300;
    else if(isNaN(tutorial)||(!isNaN(tutorial)&& (parseInt(tutorial)<1 || parseInt(tutorial)>20)))
    return -400;
    else if(pass!=passconfirm)
    return -500;
    else
    return 0;
}
socket.on('registration.duplicate.email',function(){
    swal("ERR!", "This email has already registered before", "error");
});

socket.on('registration.complete',function(){
    swal({title: "Registration complete!", text: "a link has been sent to your email . please click it to verify your mail", timer: 5000,type:"success", showConfirmButton: false },function(){
        //window.location.replace("profile.html");
    });
});

$("input[value='Login']").on('click',function(){
    var info={
        userName:$("#username").val(),
        password:$("#password").val()
    };
    socket.emit("request.login",info);
});

socket.on('invalid.login.info',function(){
    swal("ERR!!","invalid email/password","error");
});

socket.on('successful.login',function(info){
    if($("#loginkeeping").is(':checked')){
        //localStorage.pathogeniousemail=info.email;
      //  localStorage.pathogeniouspassword=info.password;
      localStorage.pathogenioususer=JSON.stringify(info);
        
    }
   /* sessionStorage.pathogeniousemail=info.email;
    sessionStorage.pathogeniouspassword=info.password;
   sessionStorage.pathogeniousdisplayName=info.displayName;
    sessionStorage.pathogeniouslevel=info.level;
    sessionStorage.pathogenioustotalScore=info.totalScore;
    sessionStorage.pathogeniouscorrectScenarios=info.correctScenarios;
    sessionStorage.pathogeniousansweredQuestions=info.answeredQuestions;
    sessionStorage.pathogeniouscorrectQuestions=info.correctQuestions;
    sessionStorage.pathogeniousansweredQuestionsCardio=info.answeredQuestionsCardio;
    sessionStorage.pathogeniouscorrectQuestionsCardio=info.correctQuestionsCardio;
    sessionStorage.pathogeniousansweredQuestionsGenetics=info.answeredQuestionsGenetics;
    sessionStorage.pathogeniouscorrectQuestionsGenetics=info.correctQuestionsGenetics;
    sessionStorage.pathogeniousansweredScenariosIds=info.answeredScenariosIds;
    sessionStorage.pathogeniousgamified=info.gamified;*/
    sessionStorage.pathogenioususer=JSON.stringify(info);
    if(info.gamified==true)
    swal({title: "Login successful!", text: "redirecting to your profile", timer: 5000,type:"success", showConfirmButton: false },function(){
        window.location.replace("profile.html");
    });
    else
     swal({title: "Login successful!", text: "redirecting to the game", timer: 5000,type:"success", showConfirmButton: false },function(){
        window.location.replace("ung-index.html");
    });
});

socket.on('not.verified.user',function(){
     swal({title:"unverified email address ",text:"please click the link sent to your mail",type:"error"});
});