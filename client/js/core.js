var socket=io();
var position = -1;
var choices=[];
var currentScenario;
var caseScore=0;
var correctPoints;
var topic;
var currentUser;
var playerLevel;
$(function() {
    if(!sessionStorage.pathogenioususer)
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
        playerLevel=currentUser.geneticsLevel;
        else if(sessionStorage.pathogenioustopic=="Cardiovascular")
        playerLevel=currentUser.cardioLevel;
        else if(sessionStorage.pathogenioustopic=="CNS")
        playerLevel=currentUser.cnsLevel;
        else if(sessionStorage.pathogenioustopic=="BloodCells")
        playerLevel=currentUser.bloodCellsLevel;
        var info={
            level:playerLevel,
            id:currentUser._id,
            topic:sessionStorage.pathogenioustopic
        };
   socket.emit("get.possible.scenario.gamified",info);
    }
});

socket.on('connect', function() {
 socket.emit('client.login',(JSON.parse(sessionStorage.pathogenioususer))._id);
});

$(window).on('unload',function(){
  
    socket.emit('client.logout',(JSON.parse(sessionStorage.pathogenioususer))._id);
})

socket.on("receive.possible.scenario.gamified",function(send){
   currentScenario=send.scenario;
   console.log("current level "+playerLevel+" And the scenario level "+currentScenario.lvl);
   if(currentScenario.lvl>playerLevel)
   swal("Higher level scenario","This scenario is a bit higher than your level in this topic . you will get extra points for each correct answer . If you wanna skip it , you can click the skip button at any time but your score wont be counted if you didn't finish the scenario !!","warning");
   else
   document.getElementById("skip").style.visibility = "hidden";
     $(".player-score").html("<b class=''>XP </b>"+caseScore+"");
     
    renderRoom(currentScenario.ini);
});

socket.on("receive.this.scenario",function(info){
    currentScenario=info.scenario;
    topic=sessionStorage.currentScenarioTopic;
    caseScore=sessionStorage.currentScenarioScore;
     $(".player-score").html("<b class=''>XP </b>"+caseScore+"");
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
        if (choice.correct == true) {
            $(eve.target).css("background-color", "#5DA423")
            swal("Good job!", "You got 20 points in your score!!!", "success")
            caseScore=caseScore+20;
            $(".player-score").html("<b class=''>XP </b>"+caseScore+"");
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
            var info={
           user:(JSON.parse(sessionStorage.pathogenioususer))._id,
           scenarioId:"",
           score:-1,
           topic:"",
           position:-1
       }
       
            swal("done", "you earned "+caseScore+" points!!","success")
            $(".action-button").html("")
            console.log("update after end of scenario.....");
            sessionStorage.removeItem("currentScenarioId");
            sessionStorage.removeItem("currentScenarioTopic");
            sessionStorage.removeItem("currentScenarioScore");
            sessionStorage.removeItem("currentScenarioPosition");
            socket.emit("save-for-later",info);
          //  location.reload();
        }
        else {

            $(".action-button").html("<a class='button nav'><i class='icon-login'></i>Move to Next Room</a>")
        }
         $(".nav").click(function() {
       
 position++
   
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
        if(caseScore<15)
        {
           swal("OOPS!", "You should have atleast 15 points in your score to eleminate!", "error")
        }
        else
        {
            caseScore=caseScore-15;
            $(".player-score").html("<b class=''>XP </b>"+caseScore+"");
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