
var socket= io();
var index = 0;
$(function() {
    
});

$("#ini-choices").on('click', "#add-choices-ini", function() {
    if ($("#add-choices-ini").text() == "add choices") {
        $("#ini-choices").html("");
        var add = "<div><label >choice:</label>  <input type='text' class='form-control ini-choice'> is correct? <input type='checkbox' class='ini-choice-correct'></div>"
        for (var i = 0; i < 4; i++) {
            $("#ini-choices").append(add);
        }
        $("#ini-choices").append("<button type='button' class='btn btn-primary' id='add-choices-ini'>remove choices</button>");
    }
    else {
        $("#ini-choices").html("");
        $("#ini-choices").append("<button type='button' class='btn btn-primary' id='add-choices-ini'>add choices</button>");
    }
});

$("#add-room").on('click', function() {
    var header;
        if(index==0)
        header="first";
    else if (index == 1)
        header = "second";
    else if (index == 2)
        header = "third";
    else if (index == 3)
        header = "fourth";
    else if (index == 4)
        header = "fifth";
    else if (index == 5)
        header = "sixth";
    else if (index == 6)
        header = "seventh";
        else if(index==7)
        header="eighth";
        else if(index==8)
        header="ninth";
        else if(index==9)
        header="tenth";
        else if((index+1)>=20 && (index+1)%10==1)
        header=(index+1)+"st";
        else if((index+1)>=20 && (index+1)%10==2)
         header=(index+1)+"nd";
         else if((index+1)>=20 && (index+1)%10==3)
         header=(index+1)+"rd"; 
         else
         header=(index+1)+"th";
        
    var toBeAdded = "<div class='panel panel-default room' data-index='room-" + index + "'>\
    <div class='panel-heading' role='tab' id='heading-" + index + "'>\
      <h4 class='panel-title'>\
        <a role='button' class='header' data-toggle='collapse' href='#' aria-expanded='true' data-target='#collapse-" + index + "'>\
        " + header + " room\
        </a>\
      </h4>\
    </div>\
    <div id='collapse-" + index + "' class='collapse in' role='tabpanel' aria-labelledby='heading-" + index + "'>\
      <div data-index='room-" + index + "' class='panel-body'>\
      <label>name</label>\
       <input type='text' class='form-control room-name'>\
      <label>text</label>\
       <textarea class='form-control room-text' data-index='" + index + "' rows='5'></textarea>\
       <label>Known so far</label>\
       <input type='text' class='form-control ksf'>\
       <div class='room-choices' data-index='room-" + index + "'>\
       <button type='button' class='btn btn-primary add-room-choices' data-index='room-" + index + "'>add choices</button>\
       </div>\
        <div class='room-remove' data-index='room-" + index + "'>\
       <button type='button' class='btn btn-primary remove-room' data-index='room-" + index + "'>remove room</button>\
       </div>\
      </div>\
    </div>\
  </div>";
    $("#rooms").append(toBeAdded);
    index++;

});

$("#rooms").on('click', ".add-room-choices", function() {
    var i = $(this).data('index');
    var choices = $(".room-choices[data-index='" + i + "']");
    choices.html("");
    if ($(this).text() == "add choices") {
        $(".room-choices[data-index='" + i + "']").html("");
        var add = "<div><label >choice:</label>  <input type='text' data-index='" + i + "' class='form-control room-choice'> is correct? <input type='checkbox' data-index='" + i + "' class='room-choice-correct'></div>";
        for (var ix = 0; ix < 4; ix++) {
            choices.append(add);
        }
        choices.append("<button type='button' class='btn btn-primary add-room-choices' data-index='" + i + "'>remove choices</button>");

    }
    else {

        $(".room-choices[data-index='" + i + "']").html("");
        choices.append("<button type='button' class='btn btn-primary add-room-choices' data-index='" + i + "'>add choices</button>");

    }

});

$("#rooms").on('click', ".remove-room", function() {

    var i = $(this).data('index');
    $(".room[data-index='" + i + "']").remove();
    index--;
    updateHeaders();
});

function updateHeaders() {
    var headers = $("a.header");

    var header = "first";
    for (var i = 0; i < headers.length; i++) {
        if (i == 1)
            header = "second";
        else if (i == 2)
            header = "third";
        else if (i == 3)
            header = "fourth";
        else if (i == 4)
            header = "fifth";
        else if (i == 5)
            header = "sixth";
        else if (i == 6)
            header = "seventh";

        headers[i].text = (header + " room");

    }
}

$("#create-scenario").on('click', function() {
    var texts = $(".room-text");
    var choices = $(".room-choice");
    var corrects = $(".room-choice-correct");
    var iniText = $("#ini-text");
    var iniChoices = $(".ini-choice");
    var iniCorreccts = $(".ini-choice-correct");

    var arr = [];
    if($(".scenario-topic").val()==""|| $(".scenario-level").val()==""||$("ini-text").val()=="")
    {
        swal("OOPPS!!","some basic information is missing","error");
        return;
    }

    for (var i = 0; i < iniChoices.length; i++) {
        var t = iniChoices[i].value;

        var c = iniCorreccts[i].checked;
        var ch = {
            text:t,
            hint: "",
            correct: c
        };
        arr[i] = ch;

    }
    var iniRoom = {
        name: "ini",
        text: $("#ini-text").val(),
        choices: arr,
        ksf: [],
        hint: "",
        score: 20
    };
/*
    var rooms = $(".room").map(function(i, room) {
        var roomChoiceCorrect = $(room).find(".room-choice-correct");
        var obj = {
            name:$($(room).find(".room-name")[0]).val(),
            text: $($(room).find(".room-text")[0]).val(),
            choices: $(room).find(".room-choice").map(function(i, choice) {
                return {
                    text: choice.value,
                    correct: roomChoiceCorrect[i].checked
                };
            })
        };
        return obj;
    });
    */
    var allRooms=$(".room");
    var rooms=[];
    for(var i = 0 ; i < allRooms.length;i++)
    {
        var name= $($(allRooms[i]).find(".room-name")[0]).val();
        var text=$($(allRooms[i]).find(".room-text")[0]).val();
        var ksf=$($(allRooms[i]).find(".ksf")[0]).val();
        var allChoices= $(allRooms[i]).find(".room-choice");
        var allCorrects= $(allRooms[i]).find(".room-choice-correct");
        var choices=[];
        for(var j=0 ; j<allChoices.length && j<allCorrects.length ; j++)
        {
            var c={
                text:allChoices[j].value,
                correct:allCorrects[j].checked
            };
            choices[j]=c;
        }
        var r = {
            name:name,
            text:text,
            choices:choices,
            ksf:ksf
        };
        rooms[i]=r;
    }
   var r=[];
   var e=[];
   for(var i =0;i<rooms.length; i++ )
   {
       if(rooms[i].name.toUpperCase()=="END")
       e.push(rooms[i])
       else
       r.push(rooms[i])
   }
    
    var s={
        topic:$(".scenario-topic").val(),
        lvl:  parseInt($(".scenario-level").val()),
        ini:iniRoom,
        rooms:r,
        end:e
    };
    socket.emit("scenario.create", s);
});

socket.on("scenario.created", function(scenario) {
    swal({title:"",text: "Scenario saved !!",   type: "success",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Confirm",   closeOnConfirm: false }, function(){  location.reload(); });
    
});
