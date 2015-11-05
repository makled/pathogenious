var socket=io();
var position = -1;
var choices=[];
var currentScenario;
var topic;
var currentUser;
var running=false;
$(function() {
    
     if(!sessionStorage.pathogenioususer)
    window.location.replace("login.html");
    else if((JSON.parse(sessionStorage.pathogenioususer)).gamified==true)
    window.location.reload("login.html");
//     else if(!sessionStorage.pathogenioustopic)
//     {
  
//         window.location.replace("profile.html");
//     }
//   /*  else if(sessionStorage.currentScenarioId){
//         console.log("current user ",sessionStorage.pathogenioususer._id);
//         var toSend={
//             user:sessionStorage.pathogenioususer._id,
//             topic:sessionStorage.pathogenioususer.currentScenarioTopic,
//             scenario:sessionStorage.pathogenioususer.currentScenarioId
//         };
//         console.log("info is ",toSend)
//      //   socket.emit("get.this.scenario",toSend);
//     }*/
//     else
else
{
       currentUser=JSON.parse(sessionStorage.pathogenioususer);
       loadInfo();
       socket.emit('client.login.ung',(JSON.parse(sessionStorage.pathogenioususer))._id);
       
    }
});

socket.on('connect', function() {
   socket.emit('client.login.ung',(JSON.parse(sessionStorage.pathogenioususer))._id);
});
$(window).on('unload',function(){
  
    socket.emit('client.logout.ung',(JSON.parse(sessionStorage.pathogenioususer))._id);
})
function loadInfo(){
  //  var pathogenioususer = JSON.parse(sessionStorage.pathogenioususer);
   // console.log(typeof pathogenioususer, typeof sessionStorage.pathogenioususer);
   // $(".scenario-topic").html(sessionStorage.pathogenioustopic);
  //  $(".question-level").html("level "+currentScenario.lvl);
     $(".genetics-score").html(currentUser.correctScenariosGenetics);
    $(".cardio-score").html(currentUser.correctScenariosCardio);
    $(".cns-score").html(currentUser.correctScenariosCNS);
    $(".bloodcells-score").html(currentUser.correctScenariosBloodCells);
   // var r = currentUser.rank==-1?"not yet ranked . play to get a rank !!":""+currentUser.rank;
 //   $(".rank").html("rank "+r);
}

// socket.on("receive.this.scenario",function(info){
//     currentScenario=info.scenario;
//     topic=sessionStorage.currentScenarioTopic;
//     caseScore=sessionStorage.currentScenarioScore;
//      $(".player-score").html("<b class=''>Case Score </b>"+caseScore+"");
//      position=sessionStorage.currentScenarioPosition;
//     if (position < currentScenario.rooms.length) {
            
//             renderRoom(currentScenario.rooms[position]);
           
//         }
//         else if(position<currentScenario.rooms.length+currentScenario.end.length){
            
//             renderRoom(currentScenario.end[position-currentScenario.rooms.length]);
           
//         }
// });

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
            $(eve.target).css("background-color", "#5DA423")
           // swal("Good job!", "You got "+ correctPoints+" points in your score!!!", "success")
        }
        else {
            $(eve.target).css("background-color", "#FF3300")
            var choices = $(".choice")
            choices.each(function() {

                if ($(this).data('choice').correct == true)
                    $(this).addClass("success")
            })


        }
        $(".choice").off('click')
        if (position == currentScenario.end.length+currentScenario.rooms.length-1) {
            $(".action-button").html("")
            sessionStorage.removeItem("currentScenarioId");
            sessionStorage.removeItem("currentScenarioTopic");
            sessionStorage.removeItem("currentScenarioScore");
            sessionStorage.removeItem("currentScenarioPosition");
            var updateInfo={
                user:currentUser._id,
                topic:topic
            };
           socket.emit("update.player.ung",updateInfo);
          //  socket.emit("update.player",toBeUpdated);
            
          //  location.reload();
        }
        else {
           

            $(".action-button").html("<a class='button nav'><i class='icon-login'></i>Move to Next Room</a>")
        }
         $(".nav").click(function() {
       
 position++
  if(position<currentScenario.rooms.length && position!=-1)
            {
       
                if(currentScenario.rooms[position].ksf&&currentScenario.rooms[position].ksf!="")
                {
                    $(".notes-list").html("<li>*"+currentScenario.rooms[position].ksf+"</li>");
                }
            }
   
       var info={
           user:(JSON.parse(sessionStorage.pathogenioususer))._id,
           scenarioId:currentScenario._id,
           topic:sessionStorage.pathogenioustopic,
           position:position
       }
       //console.log("saving for later ...."+position);
     //  socket.emit("save-for-later",info);
    
        if (position < currentScenario.rooms.length) {
            
            renderRoom(currentScenario.rooms[position])
           
        }
        else if(position<currentScenario.rooms.length+currentScenario.end.length){
            
            renderRoom(currentScenario.end[position-currentScenario.rooms.length])
           
        }
    })

    });


    $(".eleminate").click(function() {
        // if(caseScore<10)
        // {
        //   swal("OOPS!", "You should have atleast 10 points in your score to eleminate!", "error")
        // }
        // else
        {
           $(".eleminate").remove();
        var currentRoom=currentScenario.rooms[position]
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
       
        choices[n1].remove();
        choices[n2].remove();
            
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
  if(position<currentScenario.rooms.length+1&&position!=0)
            {
               
       
                if(currentScenario.rooms[position-1].ksf&&currentScenario.rooms[position-1].ksf!="")
                {
                    $(".notes-list").append("<li>*"+currentScenario.rooms[position-1].ksf+"</li>");
                }
            }
  var info={
           user:(JSON.parse(sessionStorage.pathogenioususer))._id,
           scenarioId:currentScenario._id,
           topic:sessionStorage.pathogenioustopic,
           position:position
       }
    //   socket.emit("save-for-later",info);
        if (position < currentScenario.rooms.length) {
            
            renderRoom(currentScenario.rooms[position])
           
        }
        else if(position<currentScenario.rooms.length+currentScenario.end.length){
            
            renderRoom(currentScenario.end[position-currentScenario.rooms.length])
          
        }
    })
}

socket.on("update.finished.ung",function(user){
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
    
    general();
});

$("#skip").on("click",function(){
     swal({   title: "are you sure ??",
    text: "you want to get a different scenario?!!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, skip it !!",
    cancelButtonText: "No, I'll keep solving",
    closeOnConfirm: true,
    closeOnCancel: true },
    function(isConfirm){
        if (isConfirm) {
       location.reload();
        }
                });
})

function checkBigLevel(user){
     if(user.level>currentUser.level)
    {
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
    swal({
        title: "Scenario Solved!!",
        text: "Select a Category to continue playing",
    type: "success",
    showCancelButton: false,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Got it",
    closeOnConfirm: true,
}, function(isConfirm){
    location.reload();
                });
}

$(".play-genetics").on("click",function(){
    if(running==true){
         swal({   title: "moving away !!",
    text: "Do you want to leave the current scenario ?!!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, move away !!",
    cancelButtonText: "No, I'll keep solving",
    closeOnConfirm: true,
    closeOnCancel: true },
    function(isConfirm){
        if (isConfirm) {
        location.reload();
        }
                });
    }
    else{
        running=true;
    topic="Genetics";
    sessionStorage.pathogenioustopic="Genetics";
    $("#topic-name").html("Genetics");
    socket.emit("get.possible.scenario.ung","Genetics");
    }
});

$(".play-cardio").on("click",function(){
     if(running==true){
         swal({   title: "moving away !!",
    text: "Do you want to leave the current scenario ?!!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, move away !!",
    cancelButtonText: "No, I'll keep solving",
    closeOnConfirm: true,
    closeOnCancel: true },
    function(isConfirm){
        if (isConfirm) {
        location.reload();
        }
                });
    }
    else{
    
    running=true;
     topic="CardioVascular";
     sessionStorage.pathogenioustopic="Cardiovascular";
    $("#topic-name").html("Cardiovascular");
    socket.emit("get.possible.scenario.ung","Cardiovascular");
    }
});

$(".play-cns").on("click",function(){
     if(running==true){
         swal({   title: "moving away !!",
    text: "Do you want to leave the current scenario ?!!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, move away !!",
    cancelButtonText: "No, I'll keep solving",
    closeOnConfirm: true,
    closeOnCancel: true },
    function(isConfirm){
        if (isConfirm) {
        location.reload();
        }
                });
    }
    else
    {
    running=true;
     topic="CNS";
     sessionStorage.pathogenioustopic="CNS";
    $("#topic-name").html("CNS");
    socket.emit("get.possible.scenario.ung","CNS");
    }
});

$(".play-bloodcells").on("click",function(){
     if(running==true){
         swal({   title: "moving away !!",
    text: "Do you want to leave the current scenario ?!!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, move away !!",
    cancelButtonText: "No, I'll keep solving",
    closeOnConfirm: true,
    closeOnCancel: true },
    function(isConfirm){
        if (isConfirm) {
        location.reload();
        }
                });
    }
    else
    {
        running=true;
     topic="BloodCells";
     sessionStorage.pathogenioustopic="BloodCells";
    $("#topic-name").html("BloodCells");
    socket.emit("get.possible.scenario.ung","BloodCells");
    }
});

socket.on("receive.possible.scenario.ung",function(scenario){
    currentScenario=scenario;
     document.getElementById("skip").style.display = "inherit";
    renderRoom(scenario.ini);
})