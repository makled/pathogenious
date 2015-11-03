var socket=io();
var ids=[];
var deleteIndex="";
$(".search").on('click',function(){
    if($(".scenario-level").val()=="" &&$(".scenario-topic").val()==""&&$(".ini").val()=="")
    {
         swal("OOPPS!!","all the search fields are empty","error");
         return;
    }
    var l=$(".scenario-level").val();
    var obj={
        topic:$(".scenario-topic").val(),
        lvl:parseInt(l),
        ini:$(".ini").val()
    };
    socket.emit("search",obj);
});

socket.on("receive",function(res){
    if(res.length==0)
    {
        swal("HMMM!", "No results!", "warning")
        return;
    }
    for(var x= 0 ; x < res.length ; x++)
    {
        ids[x]=res[x]._id;
    }
   $(".results").html("");
   
   for(var i = 0 ; i <res.length ; i++)
   {
        var header;
        if(i==0)
        header="first";
    else if (i == 1)
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
        else if(i==7)
        header="eighth";
        else if(i==8)
        header="ninth";
        else if(i==9)
        header="tenth";
        else if((i+1)>=20 && (i+1)%10==1)
        header=(i+1)+"st";
        else if((i+1)>=20 && (i+1)%10==2)
         header=(i+1)+"nd";
         else if((i+1)>=20 && (i+1)%10==3)
         header=(i+1)+"rd"; 
         else
         header=(i+1)+"th";
       var toBeAdded="<div class='panel panel-default scenario' data-index='" + i + "'>\
    <div class='panel-heading' role='tab'>\
      <h4 class='panel-title'>\
        <a role='button' class='header' data-toggle='collapse' aria-expanded='true' data-target='#collapse-" + i + "'>\
        " + header + " scenario\
        </a>\
      </h4>\
    </div>\
    <div id='collapse-" + i + "' class='collapse in' role='tabpanel' >\
      <div data-index='" + i + "' class='panel-body'>\
      <label>topic</label>\
       <input data-index='" + i + "' type='text' class='form-control span12 scenario-topic'>\
      <label>level</label>\
        <input data-index='" + i + "' type='text' class='form-control span12 scenario-level'>\
        <div class='panel panel-default'>\
    <div class='panel-heading' role='tab'>\
    <h4 class='panel-title'></h4>\
    <a role='button' data-toggle='collapse' data-target='#ini-"+i+"'>Initial:</a>\
    </h4>\
    </div>\
    <div class='collapse in' id='ini-"+i+"'>\
  <textarea data-index='" + i + "' class='form-control span12 ini-text' rows='5'></textarea>\
   <div data-index='" + i + "' class='ini-choices'>\
    </div>\
    </div>\
     </div>\
     <label>Rooms:</label>\
     <div  data-index='" + i + "' class='rooms'>\
     </div>\
      <label>Ends:</label>\
     <div  data-index='" + i + "' class='ends'>\
     </div>\
     <br>\
     <br>\
     <br>\
      <div>\
      <button data-index='" + i + "' type='button' class='btn btn-primary remove-scenario'>remove scenario</button>\
     </div>\
     <br>\
      <div>\
      <button  data-index='" + i + "' type='button' class='btn btn-primary update-scenario'>update scenario</button>\
     </div>\
      </div>\
    </div>\
  </div>";
  $(".results").append(toBeAdded);
   $(".scenario-topic[data-index='" + i + "']").val(res[i].topic);
    $(".scenario-level[data-index='" + i + "']").val(res[i].lvl);
     $(".ini-text[data-index='" + i + "']").val(res[i].ini.text);
     if(res[i].ini.choices.length==0)
     $(".ini-choices[data-index='" + i + "']").append( "<button  data-index='" + i + "' type='button' class='btn btn-primary add-choices-ini'>add choices</button>");
     else
     {
         var choices= $(".ini-choices[data-index='" + i + "']");
         
         for(var j=0; j<res[i].ini.choices.length ; j++)
         {
             var add = "<div><label >choice:</label>  <input type='text' data-index='" + i + "' class='form-control ini-choice' value='"+res[i].ini.choices[j].text+"'> is correct? <input type='checkbox' data-index='" + i + "' class='ini-choice-correct'></div>";
              choices.append(add);
             var checkBoxes=$(".ini-choice-correct[data-index='" + i + "']");
             checkBoxes[j].checked=res[i].ini.choices[j].correct;
         }
         choices.append("<button  data-index='" + i + "' type='button' class='btn btn-primary remove-choices-ini'>remove choices</button>");
         
     }
     for(var jx = 0 ; jx <res[i].rooms.length; jx++)
     {
          var n = "<div class='room' data-index='"+i+"'>\
          <div class='panel panel-default room' data-index='" + i + "-"+jx+ "'>\
    <div class='panel-heading' role='tab'>\
      <h4 class='panel-title'>\
        <a role='button' class='header' data-toggle='collapse' aria-expanded='true' data-target='#room-" + i + "-"+jx+"'>\
         room\
        </a>\
      </h4>\
    </div>\
    <div id='room-" + i + "-"+jx+"' class='collapse in'>\
      <div data-index='" + i + "-"+jx+ "' class='panel-body'>\
      <label>name</label>\
       <input type='text' data-index='" + i + "-"+jx+ "' class='form-control room-name'>\
      <label>text</label>\
       <textarea class='form-control room-text span12' data-index='" + i + "-"+jx+ "' rows='5'></textarea>\
       <label>Known so far</label>\
       <input type='text' data-index='" + i + "-"+jx+ "' class='form-control ksf'>\
       <div class='room-choices' data-index='" + i + "-"+jx+"'>\
       </div>\
       <button type='button' class='btn btn-primary remove-room' data-index='" + i + "-"+jx+ "'>remove room</button>\
      </div>\
    </div>\
  </div>\
  </div>";
  $(".rooms[data-index='" + i + "']").append(n);
  var m=res[i].rooms[jx];
 // if(res[i].rooms[jx].length>0)
//  m=res[i].rooms[jx][jx];
   if(m.choices.length==0)
     $(".room-choices[data-index='" + i + "-"+jx+ "']").append( "<button type='button' class='btn btn-primary add-room-choices' data-index='" + i + "-"+jx+ "'>add choices</button>");
     else
     {
         var c= $(".room-choices[data-index='" + i + "-"+jx+ "']");
         
         for(var k=0; k<m.choices.length ; k++)
         {
             var addx = "<div><label >choice:</label>  <input type='text' data-index='" + i + "-"+jx+ "' class='form-control room-choice span10' value='"+m.choices[k].text+"'> is correct? <input type='checkbox' data-index='" + i + "-"+jx+ "' class='room-choice-correct'></div>";
              c.append(addx);
             var cb=$(".room-choice-correct[data-index='" + i + "-"+jx+ "']");
             cb[k].checked=m.choices[k].correct;
         }
         c.append("<button  data-index='" + i + "-"+jx+ "' type='button' class='btn btn-primary remove-choices-room'>remove choices</button>");
         
     }
     $(".room-name[data-index='"+i+"-"+jx+"']").val(m.name);
      $(".room-text[data-index='"+i+"-"+jx+"']").val(m.text);
       $(".ksf[data-index='"+i+"-"+jx+"']").val(m.ksf);
  
     }
     
      for(var jy = 0 ; jy < res[i].end.length; jy++)
     {
          var ny = "<div class='end' data-index='"+i+"'>\
          <div class='panel panel-default end' data-index='" + i + "-"+jy+ "'>\
    <div class='panel-heading' role='tab'>\
      <h4 class='panel-title'>\
        <a role='button' class='header' data-toggle='collapse' aria-expanded='true' data-target='#end-" + i + "-"+jy+"'>\
         end\
        </a>\
      </h4>\
    </div>\
    <div id='end-" + i + "-"+jy+"' class='collapse in'>\
      <div data-index='" + i + "-"+jy+ "' class='panel-body'>\
      <label>name</label>\
       <input type='text' data-index='" + i + "-"+jy+ "' class='form-control end-name'>\
      <label>text</label>\
       <textarea class='form-control end-text span12' data-index='" + i + "-"+jy+ "' rows='5'></textarea>\
       <label>Known so far</label>\
       <input type='text' data-index='" + i + "-"+jy+ "' class='form-control end-ksf'>\
       <div class='end-choices' data-index='" + i + "-"+jy+"'>\
       </div>\
       <button type='button' class='btn btn-primary remove-end' data-index='" + i + "-"+jy+ "'>remove room</button>\
      </div>\
    </div>\
  </div>\
  </div>";
  $(".ends[data-index='" + i + "']").append(ny);
  var e=res[i].end[jy];
 // if(res[i].end[jy].length>0)
 // e=res[i].end[jy][jy];
   if(e.choices.length==0)
     $(".end-choices[data-index='" + i + "-"+jy+ "']").append( "<button type='button' class='btn btn-primary add-end-choices' data-index='" + i + "-"+jy+ "'>add choices</button>");
     else
     {
         var cy= $(".end-choices[data-index='" + i + "-"+jy+ "']");
         
         for(var ky=0; ky<e.choices.length ; ky++)
         {
             var addy = "<div><label >choice:</label>  <input type='text' data-index='" + i + "-"+jy+ "' class='form-control end-choice span10' value='"+e.choices[ky].text+"'> is correct? <input type='checkbox' data-index='" + i + "-"+jy+ "' class='end-choice-correct'></div>";
              cy.append(addy);
             var cby=$(".end-choice-correct[data-index='" + i + "-"+jy+ "']");
             cby[ky].checked=e.choices[ky].correct;
         }
         cy.append("<button  data-index='" + i + "-"+jy+ "' type='button' class='btn btn-primary remove-choices-end'>remove choices</button>");
         
     }
     $(".end-name[data-index='"+i+"-"+jy+"']").val(e.name);
      $(".end-text[data-index='"+i+"-"+jy+"']").val(e.text);
      $(".end-ksf[data-index='"+i+"-"+jy+"']").val(e.ksf);
  
     }
   }
});

$(".results").on('click','.remove-choices-ini',function(){
   var i = $(this).data('index'); 
    $(".ini-choices[data-index='" + i + "']").html("<button  data-index='" + i + "' type='button' class='btn btn-primary add-choices-ini'>add choices</button>");
   
});

$(".results").on('click',".add-choices-ini",function(){
     var i = $(this).data('index');
      $(".ini-choices[data-index='" + i + "']").html("");
        var add = "<div><label >choice:</label>  <input type='text' data-index='" + i + "' class='form-control ini-choice'> is correct? <input type='checkbox' data-index='" + i + "' class='ini-choice-correct'></div>";
        for (var ix = 0; ix < 4; ix++) {
             $(".ini-choices[data-index='" + i + "']").append(add);
        }
        $(".ini-choices[data-index='" + i + "']").append("<button type='button' class='btn btn-primary remove-choices-ini' data-index='" + i + "'>remove choices</button>");
});

$(".results").on('click',".remove-choices-room",function(){
     var i = $(this).data('index'); 
    $(".room-choices[data-index='" + i + "']").html("<button  data-index='" + i + "' type='button' class='btn btn-primary add-choices-room'>add choices</button>");
});

$(".results").on('click',".add-choices-room",function(){
     var i = $(this).data('index');
      $(".room-choices[data-index='" + i + "']").html("");
        var add = "<div><label >choice:</label>  <input type='text' data-index='" + i + "' class='form-control room-choice'> is correct? <input type='checkbox' data-index='" + i + "' class='room-choice-correct'></div>";
        for (var ix = 0; ix < 4; ix++) {
             $(".room-choices[data-index='" + i + "']").append(add);
        }
        $(".room-choices[data-index='" + i + "']").append("<button type='button' class='btn btn-primary remove-choices-room' data-index='" + i + "'>remove choices</button>");
});

$(".results").on('click',".remove-room",function(){
      var i = $(this).data('index');
    $(".room[data-index='" + i + "']").remove();
});

$(".results").on('click',".remove-choices-end",function(){
     var i = $(this).data('index'); 
    $(".end-choices[data-index='" + i + "']").html("<button  data-index='" + i + "' type='button' class='btn btn-primary add-choices-end'>add choices</button>");
});

$(".results").on('click',".add-choices-end",function(){
     var i = $(this).data('index');
      $(".end-choices[data-index='" + i + "']").html("");
        var add = "<div><label >choice:</label>  <input type='text' data-index='" + i + "' class='form-control end-choice'> is correct? <input type='checkbox' data-index='" + i + "' class='end-choice-correct'></div>";
        for (var ix = 0; ix < 4; ix++) {
             $(".end-choices[data-index='" + i + "']").append(add);
        }
        $(".end-choices[data-index='" + i + "']").append("<button type='button' class='btn btn-primary remove-choices-end' data-index='" + i + "'>remove choices</button>");
});

$(".results").on('click',".remove-end",function(){
      var i = $(this).data('index');
    $(".end[data-index='" + i + "']").remove();
});

$(".results").on('click',".update-scenario",function(){
      var index = $(this).data('index');
      var ii=parseInt(index);
      var id=ids[ii];
      var t=$(".scenario-topic[data-index='"+index+"']").val();
      var l=$(".scenario-level[data-index='"+index+"']").val();
      var iniText=$(".ini-text[data-index='"+index+"']").val();
      var iniChoices=$(".ini-choice[data-index='"+index+"']");
      var iniChoiceCorrect=$(".ini-choice-correct[data-index='"+index+"']");
      var arr=[];
      for(var w=0; w<iniChoices.length ; w++)
      {
        var x={
            text:iniChoices[w].value,
            hint:"",
            correct:iniChoiceCorrect[w].checked
        }  ;
        arr[w]=x;
      }
      var iniRoom={
        name:"ini",
        text:iniText,
        choices:arr,
        ksf:[],
        hint:"",
        score:20
      };
      /*
       var rooms = $(".room[data-index='"+index+"']").map(function(i, room) {
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
    console.log("rooms: "+JSON.stringify(rooms));
    var ends = $(".end[data-index='"+index+"']").map(function(i, room) {
        var roomChoiceCorrect = $(room).find(".end-choice-correct");
        var obj = {
            name:$($(room).find(".end-name")[0]).val(),
            text: $($(room).find(".end-text")[0]).val(),
            choices: $(room).find(".end-choice").map(function(i, choice) {
                return {
                    text: choice.value,
                    correct: roomChoiceCorrect[i].checked
                };
            })
        };
        return obj;
    });
    */
    var allRooms=$(".room[data-index='"+index+"']");
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
             ksf:ksf,
            choices:choices
        };
        rooms[i]=r;
    }
    
    var allEnds=$(".end[data-index='"+index+"']");
    var ends=[];
    for(var i = 0 ; i<allEnds.length ; i++)
    {
         var name= $($(allEnds[i]).find(".end-name")[0]).val();
        var text=$($(allEnds[i]).find(".end-text")[0]).val();
        var ksf=$($(allEnds[i]).find(".end-ksf")[0]).val();
        var allChoices= $(allEnds[i]).find(".end-choice");
        var allCorrects= $(allEnds[i]).find(".end-choice-correct");
        var choices=[];
        for(var j=0 ; j<allChoices.length && j<allCorrects.length ; j++)
        {
            var c={
                text:allChoices[j].value,
                correct:allCorrects[j].checked
            };
            choices[j]=c;
        }
        var e = {
            name:name,
            text:text,
             ksf:ksf,
            choices:choices
        };
        ends[i]=e;
    }
   var scenario= {
    topic:t,
    lvl: l,
	ini: iniRoom,
	rooms: rooms,
	end:ends
   };
 var req={
     scenario:scenario,
     id:id
 };
 socket.emit("request.update",req);
});

socket.on('update.done',function(){
    swal("Done!", "The scenario got updated", "success");
})

$(".results").on('click',".remove-scenario",function(){
    var index = $(this).data('index');
    swal({   title: "Are you sure?",
    text: "You will not be able to recover this Scenario!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!",
    closeOnConfirm: false
    } , function(){
    
    deleteIndex=index;
    var ii=parseInt(index);
    var id=ids[ii];
     console.log("deleting scenario with id :"+id);
    socket.emit("request.remove",id);
        });
});

socket.on('remove.done',function(){
    $(".scenario[data-index='"+deleteIndex+"']").remove();
    deleteIndex="";
    swal("Done!", "The scenario has been removed", "success");
})