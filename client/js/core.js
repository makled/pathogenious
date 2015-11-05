var socket=io();
var position = -1;
var choices=[];
var currentScenario;
var caseScore=0;
var correctPoints;
var topic;
var currentUser;
var playerLevel;
var playerScore;
var answered=0;
var correct=0;
var repeated;
$(function() {
    
    if(!sessionStorage.pathogenioususer)
    window.location.replace("login.html");
    else if((JSON.parse(sessionStorage.pathogenioususer)).gamified==false)
    window.location.replace("login.html");
    else if(!sessionStorage.pathogenioustopic)
    {
  
        window.location.replace("profile.html");
    }
  /*  else if(sessionStorage.currentScenarioId){
        console.log("current user ",sessionStorage.pathogenioususer._id);
        var toSend={
            user:sessionStorage.pathogenioususer._id,
            topic:sessionStorage.pathogenioususer.currentScenarioTopic,
            scenario:sessionStorage.pathogenioususer.currentScenarioId
        };
        console.log("info is ",toSend)
     //   socket.emit("get.this.scenario",toSend);
    }*/
    else
{
       currentUser=JSON.parse(sessionStorage.pathogenioususer);
        if(sessionStorage.pathogenioustopic=="Genetics")
        {
        playerLevel=currentUser.geneticsLevel;
        playerScore=currentUser.geneticsScore;
        }
        else if(sessionStorage.pathogenioustopic=="Cardiovascular")
        {
        playerLevel=currentUser.cardioLevel;
        playerScore=currentUser.cardioScore;
        }
        else if(sessionStorage.pathogenioustopic=="CNS")
        {
        playerLevel=currentUser.cnsLevel;
        playerScore=currentUser.cnsScore;
        }
        else if(sessionStorage.pathogenioustopic=="BloodCells")
        {
        playerLevel=currentUser.bloodCellsLevel;
        playerScore=currentUser.bloodCellsScore;
        }
        var info={
            level:playerLevel,
            id:currentUser._id,
            topic:sessionStorage.pathogenioustopic
        };
   socket.emit("get.possible.scenario.gamified",info);
    }
});

socket.on('connect', function() {
    var info={
        id:(JSON.parse(sessionStorage.pathogenioususer))._id,
        score:(JSON.parse(sessionStorage.pathogenioususer)).totalScore
    };
 socket.emit('client.login.gamified',info);
});

$(window).on('unload',function(){
    var info={
        id:(JSON.parse(sessionStorage.pathogenioususer))._id,
        score:(JSON.parse(sessionStorage.pathogenioususer)).totalScore
    };
  
    socket.emit('client.logout.gamified',info);
})

socket.on("receive.possible.scenario.gamified",function(send){
   currentScenario=send.scenario;
   repeated=send.repeated;
   if(repeated==true)
   {
       swal("Repeated Scenario","You solved this scenario before . You can still resolve it to revise what you have done . However , you wont get any score by resolving it . You can skip solving it at any time by clicking on the skip scenario button ","warning");
       
   }
//   else if(!currentScenario)
//   {
//       currentUser=JSON.parse(sessionStorage.pathogenioususer);
//         if(sessionStorage.pathogenioustopic=="Genetics")
//         {
//         playerLevel=currentUser.geneticsLevel;
//         playerScore=currentUser.geneticsScore;
//         }
//         else if(sessionStorage.pathogenioustopic=="Cardiovascular")
//         {
//         playerLevel=currentUser.cardioLevel;
//         playerScore=currentUser.cardioScore;
//         }
//         else if(sessionStorage.pathogenioustopic=="CNS")
//         {
//         playerLevel=currentUser.cnsLevel;
//         playerScore=currentUser.cnsScore;
//         }
//         else if(sessionStorage.pathogenioustopic=="BloodCells")
//         {
//         playerLevel=currentUser.bloodCellsLevel;
//         playerScore=currentUser.bloodCellsScore;
//         }
//         var info={
//             level:playerLevel,
//             id:currentUser._id,
//             topic:sessionStorage.pathogenioustopic
//         };
//   return  socket.emit("get.possible.scenario.gamified",info);
//   }
   
   else  if(currentScenario.lvl>playerLevel)
   swal("Higher level scenario","This scenario is a bit higher than your level in this topic . you will get extra points for each correct answer . If you wanna skip it , you can click the skip button at any time but your score wont be counted if you didn't finish the scenario !!","warning");
   else
   document.getElementById("skip").style.visibility = "hidden";
  // console.log("current level "+playerLevel+" And the scenario level "+currentScenario.lvl);
   if(playerLevel==1)
   {
       if(currentScenario.lvl==1)
       correctPoints=20;
       else if(currentScenario.lvl==2)
       correctPoints=30;
       else 
       correctPoints=40;
   }
   else if(playerLevel==2)
   {
       if(currentScenario.lvl==1)
       correctPoints=10;
       else if(currentScenario.lvl==2)
       correctPoints=20;
       else 
       correctPoints=30;
   }
   else if(playerLevel==3)
   {
       if(currentScenario.lvl==1)
       correctPoints=10;
       else if(currentScenario.lvl==2)
       correctPoints=10;
       else 
       correctPoints=20;
   }
  
     $(".player-score").html("<b class=''>Case Score </b>"+caseScore+"");
     loadInfo();
    renderRoom(currentScenario.ini);
});

function loadInfo(){
  //  var pathogenioususer = JSON.parse(sessionStorage.pathogenioususer);
   // console.log(typeof pathogenioususer, typeof sessionStorage.pathogenioususer);
    $(".scenario-topic").html(sessionStorage.pathogenioustopic);
    $(".question-level").html("level "+currentScenario.lvl);
     $(".genetics-score").html(currentUser.correctScenariosGenetics);
    $(".cardio-score").html(currentUser.correctScenariosCardio);
    $(".cns-score").html(currentUser.correctScenariosCNS);
    $(".bloodcells-score").html(currentUser.correctScenariosBloodCells);
    var r = currentUser.rank==-1?"not yet ranked . play to get a rank !!":""+currentUser.rank;
    $(".rank").html("rank "+r);
}

socket.on("receive.this.scenario",function(info){
    currentScenario=info.scenario;
    topic=sessionStorage.currentScenarioTopic;
    caseScore=sessionStorage.currentScenarioScore;
     $(".player-score").html("<b class=''>Case Score </b>"+caseScore+"");
     position=sessionStorage.currentScenarioPosition;
    if (position < currentScenario.rooms.length) {
            
            renderRoom(currentScenario.rooms[position]);
           
        }
        else if(position<currentScenario.rooms.length+currentScenario.end.length){
            
            renderRoom(currentScenario.end[position-currentScenario.rooms.length]);
           
        }
});

function renderRoom(room) {

   var select=$("#ini")
   if(room.name!="ini")
   {
    var roomIcon
    if(room.name.toLowerCase()=="examination room" || room.name.toLowerCase()=="examination"){
        roomIcon="icon-stethoscope";
    }
    else{
        if(room.name.toLowerCase()=="emergency"){
            roomIcon="icon-ambulance";
        }
        else{
            if(room.name.toLowerCase()=="lab" || room.name.toLowerCase()=="laboratory"){
                roomIcon="icon-i-laboratory";
            }
            else{
                if(room.name.toLowerCase()=="genetics"||room.name.toLowerCase()=="genetic counseling"||room.name.toLowerCase()=="counseling"){
                roomIcon="icon-i-genetics";
                }
                else{
                    if(room.name.toLowerCase()=="operation" || room.name.toLowerCase()=="operation room"){
                        roomIcon="icon-i-surgery";
                    }
                    else{
                        if(room.name.toLowerCase()=="imaging"){
                            roomIcon="icon-i-radiology"
                        }
                    }
                }
            }
            
        }
    }
    select=$("#room-text")
    $("#room-name").html("<i class='"+roomIcon+"'></i>"+room.name)
   }
   select.text(room.text)
   renderChoices(room)
    $(".navigate").click(function() {

        $("#ini-choices").html("");

        renderRoom(currentScenario.rooms[position]);
    });

    $(".choice").on('click', function(eve) {
        var choice = $(this).data("choice");
        if (choice.correct == true ) {
            if(repeated==false)
            correct++;
            $(eve.target).css("background-color", "#5DA423")
           // swal("Good job!", "You got "+ correctPoints+" points in your score!!!", "success")
           if(repeated==false)
            caseScore=caseScore+correctPoints;
            $(".player-score").html("<b class=''>Case Score </b>"+caseScore+"");
        }
        else {
            $(eve.target).css("background-color", "#FF3300")
            var choices = $(".choice")
            choices.each(function() {

                if ($(this).data('choice').correct == true)
                    $(this).addClass("success")
            })


        }
        if(repeated==false)
        answered++;

        $(".choice").off('click')
        if (position == currentScenario.end.length+currentScenario.rooms.length-1) {
            $(".action-button").html("")
            console.log("update after end of scenario.....");
            sessionStorage.removeItem("currentScenarioId");
            sessionStorage.removeItem("currentScenarioTopic");
            sessionStorage.removeItem("currentScenarioScore");
            sessionStorage.removeItem("currentScenarioPosition");
            
            var toBeUpdated={
                user:currentUser._id,
                scenario:currentScenario._id,
                topic:sessionStorage.pathogenioustopic,
                score:caseScore,
                answered:answered,
                correct:correct,
                specificLevel:playerLevel,
                overallLevel:currentUser.level,
                repeated:repeated
            };
            socket.emit("update.player",toBeUpdated);
            
          //  location.reload();
        }
        else {
           

            $(".action-button").html("<a class='button nav'><i class='icon-login'></i>Move to Next Room</a>")
        }
         $(".nav").click(function() {
       
 position++
 console.log("po"+position);
  if(position<currentScenario.rooms.length+1 && position!=0)
            {
       
                if(currentScenario.rooms[position-1].ksf&&currentScenario.rooms[position-1].ksf!="")
                {
                    $(".notes-list").html("<li>*"+currentScenario.rooms[position-1].ksf+"</li>");
                }
            }
   
       var info={
           user:(JSON.parse(sessionStorage.pathogenioususer))._id,
           scenarioId:currentScenario._id,
           score:caseScore,
           topic:sessionStorage.pathogenioustopic,
           position:position
       }
       console.log("saving for later ...."+position);
       socket.emit("save-for-later",info);
    
        if (position < currentScenario.rooms.length) {
            
            renderRoom(currentScenario.rooms[position])
           
        }
        else if(position<currentScenario.rooms.length+currentScenario.end.length){
            
            renderRoom(currentScenario.end[position-currentScenario.rooms.length])
           
        }
    })

    });


    $(".eleminate").click(function() {
        if(caseScore<10)
        {
           swal("OOPS!", "You should have atleast 10 points in your score to eleminate!", "error")
        }
        else
        {
            swal({
                title: "Elemenation is not for free !!",
                text: "If you use this feature , 10 points will be deducted from your current score",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Eleminate!",
                closeOnConfirm: true },
                function(){
                   caseScore=caseScore-10;
            $(".player-score").html("<b class=''>Case Score </b>"+caseScore+"");
        $(".eleminate").remove();
        var currentRoom=currentScenario.rooms[position]
        console.log(" at position "+position)
        if(position>=currentScenario.rooms.length)
        currentRoom=currentScenario.end[position-currentScenario.rooms.length]
        var n1 = Math.floor(Math.random() *currentRoom.choices.length);
        var choices = $(".choice");
        
        while (currentRoom.choices[n1].correct) {
            n1 = Math.floor(Math.random() * currentRoom.choices.length);
        }
        var n2 = n1;
        while (n2 == n1 || currentRoom.choices[n2].correct) {
            n2 = Math.floor(Math.random() * currentRoom.choices.length);
        }
       
        choices[n1].remove()
        choices[n2].remove()
                });
            
        }

    });

   

}

function renderChoices(room) {
    var roomChoices = $("#room-choices");
    if (room.name == "ini")
        roomChoices == $("#ini-choices");

    roomChoices.html("");
    room.choices.forEach(function(choice) {
        var button = $("<a class='button choice'>" + choice.text + "</a>");
        button.data("choice", choice);
        button.data("room", room);
        roomChoices.append(button);
    });
    if(room.choices.length>0)
        $(".action-button").html("<a class='eleminate button'><i class='icon-cancel'></i>Eliminate 2 Wrong choices</a>");
    else
        $(".action-button").html("<a class='button nav'><i class='icon-login'></i>Move to Next Room</a>")
        
         $(".nav").click(function() {
 position++
  console.log("pos "+position);
  if(position<currentScenario.rooms.length&&position!=-1)
            {
               
       
                if(currentScenario.rooms[position].ksf&&currentScenario.rooms[position].ksf!="")
                {
                    $(".notes-list").append("<li>*"+currentScenario.rooms[position].ksf+"</li>");
                }
            }
  var info={
           user:(JSON.parse(sessionStorage.pathogenioususer))._id,
           scenarioId:currentScenario._id,
           score:caseScore,
           topic:sessionStorage.pathogenioustopic,
           position:position
       }
       console.log("saving for later ...."+info.topic);
       socket.emit("save-for-later",info);
        if (position < currentScenario.rooms.length) {
            
            renderRoom(currentScenario.rooms[position])
           
        }
        else if(position<currentScenario.rooms.length+currentScenario.end.length){
            
            renderRoom(currentScenario.end[position-currentScenario.rooms.length])
          
        }
    })
}

socket.on("update.finished",function(user){
    sessionStorage.pathogenioususer=JSON.stringify(user);
  /*  if(playerLevel==1&&playerScore+caseScore>1000)
    {
        console.log("entered promotion level 2");
        swal({
            title: "Promotion!!?",
            text: "You have been promoted to lvl 2 in "+sessionStorage.pathogenioustopic+" !!",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sweet!!",
            closeOnConfirm: true }, function(){
               checkBigLevel(user); });
    }
  else if(playerLevel==2&&playerScore+caseScore>=2000)
  {
      console.log("entered promotion level 3")
      swal({
            title: "Promotion!!?",
            text: "You have been promoted to lvl 3 in "+sessionStorage.pathogenioustopic+" !!",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sweet!!",
            closeOnConfirm: true }, function(){
               checkBigLevel(user); });
  }
      
   
    else
    checkBigLevel(user);*/
    
   window.setTimeout(general(),5000) ;
});

$("#skip").on("click",function(){
     swal({   title: "are you sure ??",
    text: "if you leave this scenario now , you will lose any possible score you got !!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, skip and get me back to profile !!",
    cancelButtonText: "No, I'll keep solving",
    closeOnConfirm: true,
    closeOnCancel: true },
    function(isConfirm){
        if (isConfirm) {
        window.location.replace("profile.html");
        }
                });
})

function checkBigLevel(user){
     if(user.level>currentUser.level)
    {
        console.log("entered title promotion")
        var rank=user.level==2?"Senior Resident":"Chief Resident";
         swal({
            title: "Promotion!!?",
            text: "You are now a "+rank+" !!",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Great!!",
            closeOnConfirm: true }, function(){
               general(); });
    }
    else
    general();
}

function general()
{
    console.log("entered final step")
    swal({
        title: "Scenario Solved!!",
        text: "You got "+caseScore+" points in your score do you wanna continue playing in this topic??",
    type: "success",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, I wanna continue",
    cancelButtonText: "No, Take me back to profile!",
    closeOnConfirm: true,
    closeOnCancel: true }, function(isConfirm){
        if (isConfirm) {
           location.reload();
            } else {
               window.location.replace("profile.html");
                }
                });
}