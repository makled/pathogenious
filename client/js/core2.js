var socket=io();
var position = -1;
var scenarios = [];
var choices=[];
var currentScenario;
var caseScore=0;
$(function() {
  //  if(sessionStorage.pathogeniousmail==undefined && sessionStorage.pathogeniouspassword==undefined)
  // window.location.replace("login.html");
  //  else
   socket.emit("get.possible.scenarios",1);
});

socket.on("receive.possible.scenarios",function(res){
   scenarios=res;
    var toGet = Math.random() * (scenarios.length);
    currentScenario = scenarios[Math.floor(toGet)];
     $("#score").text("score so far :"+caseScore);
    renderRoom(currentScenario.ini);
});


function renderRoom(room) {
var tabs=$(".tab-content");
var refs=$(".nav-tabs");
  refs.append("<liclass='active'><a data-toggle='tab' href='#"+room.name+"'>"+room.name+"</a></li>");
  var tobeadded="<div id='"+room.name+"' class='tab-pane fade in active'>\
      <p>"+room.text+"</p>\
    </div>";
tabs.append(tobeadded);
   

}

function renderChoices(room) {
    var roomChoices = $("#room-choices");
    if (room.name == "ini")
        roomChoices == $("#ini-choices");

    roomChoices.html("");
    room.choices.forEach(function(choice) {
        var button = $("<a class='button choice'><span>" + choice.text + "</span></a>");
        button.data("choice", choice);
        button.data("room", room);
        roomChoices.append(button);
    });
    if(room.choices.length>0)
        $("#eleminate").html("<a class='eleminate'>eleminate 2 wrong options</a>");
    else
        $("#eleminate").html("<a class='nav blue medium'>navigate to next room</a>")
        
         $(".nav").click(function() {
 position++
        if (position < currentScenario.rooms.length) {
            
            renderRoom(currentScenario.rooms[position])
           
        }
        else if(position<currentScenario.rooms.length+currentScenario.end.length){
            
            renderRoom(currentScenario.end[position-currentScenario.rooms.length])
          
        }
    })
}