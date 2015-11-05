var socket=io();
$(function(){
    if( !sessionStorage.pathogenioususer)
    window.location.replace("login.html");
    else
   
    socket.emit("update.rank",(JSON.parse(sessionStorage.pathogenioususer))._id);
});

function loadInfo()
{
    
    var user=JSON.parse(sessionStorage.pathogenioususer);
    $(".player-name").html(user.displayName);
   
    var title;
    if((user.level)==1)
    title="Junior resident";
    else if((user.level)==2)
    title="Senior resident";
    else
    title="Chief resident";
    $(".player-level").html(title);
     var r = user.rank==-1?"not yet ranked . play to get a rank !!":""+user.rank;
    $(".player-streak").html("<i class='icon-fire'></i>"+"rank "+r);
    $(".genetics-score").text(user.correctScenariosGenetics);
    $(".cardiology-score").text(user.correctScenariosCardio);
    $(".neurology-score").text(user.correctScenariosCNS);
    $(".bloodcells-score").text(user.correctScenariosBloodCells);
    var x ,y ,z,w ;
    if(user.answeredQuestionsGenetics==0)
    x=0;
    else
    x=user.correctQuestionsGenetics/user.answeredQuestionsGenetics*100;
     if(user.answeredQuestionsCardio==0)
    y=0;
    else
    y=user.correctQuestionsCardio/user.answeredQuestionsCardio*100;
     if(user.answeredQuestionsCNS==0)
    z=0;
    else
    z=user.correctQuestionsCNS/user.answeredQuestionsCNS*100;
     if(user.answeredQuestionsBloodCells==0)
    w=0;
    else
    w=user.correctQuestionsBloodCells/user.answeredQuestionsBloodCells*100;
    samurai(x,y,z,w);
    
    $(".genetics-level").html("level "+user.geneticsLevel);
    $(".cardio-level").html("level "+user.cardioLevel);
     $(".cns-level").html("level "+user.cnsLevel);
     $(".bloodcells-level").html("level "+user.bloodCellsLevel);
     $(".player-total-score").html("total score: "+user.totalScore);
     
     var geneticsProgress=user.geneticsLevel==1?user.geneticsScore/600*100:user.geneticsLevel==2?(user.geneticsScore-600)/800*100:(user.geneticsScore-1400)/1000*100;
     var geneticsValue="width:"+geneticsProgress+"%;";
     var cardioProgress=user.cardioLevel==1?user.cardioScore/600*100:user.cardioLevel==2?(user.cardioScore-600)/800*100:(user.cardioScore-1400)/1000*100;
      var cardioValue="width:"+cardioProgress+"%;";
     var cnsProgress=user.cnsLevel==1?user.cnsScore/600*100:(user.cnsLevel==2?(user.cnsScore-600)/800*100:(user.cnsScore-1400)/1000*100);
      var cnsValue="width:"+cnsProgress+"%;";
     var bloodCellsProgress=user.bloodCellsLevel==1?user.bloodCellsScore/600*100:(user.bloodCellsLevel==2?(user.bloodCellsScore-600)/800*100:(user.bloodCellsScore-1400)/1000*100);
      var bloodCellsValue="width:"+bloodCellsProgress+"%;";
      var overallProgress=user.level==1?user.totalScore/3000*100:(user.level==2?(user.totalScore-3000)/2000*100:(user.totalScore-5000)/2000*100);
      var overallValue="width:"+overallProgress+"%;";
     $("#geneticsMeter").attr('style', geneticsValue);
     $("#cardioMeter").attr('style', cardioValue);
     $("#cnsMeter").attr('style', cnsValue);
     $("#bloodMeter").attr('style', bloodCellsValue);
     $("#levelMeter").attr('style',overallValue);
}
$(".play-genetics").on('click',function(){
    var info={
        topic:"Genetics",
        user:(JSON.parse(sessionStorage.pathogenioususer))._id
    };
    socket.emit("confirm-not-done",info);
});

$(".play-cardio").on('click',function(){
    var info={
        topic:"Cardiovascular",
        user:(JSON.parse(sessionStorage.pathogenioususer))._id
    };
    socket.emit("confirm-not-done",info);
});

$(".play-cns").on('click',function(){
    var info={
        topic:"CNS",
        user:(JSON.parse(sessionStorage.pathogenioususer))._id
    };
    socket.emit("confirm-not-done",info);
});

$(".play-bloodcells").on('click',function(){
     var info={
        topic:"BloodCells",
        user:(JSON.parse(sessionStorage.pathogenioususer))._id
    };
    socket.emit("confirm-not-done",info);
});

socket.on("empty",function(){
    swal("HMMMM","there are no scenarios there yet, Come back later !!","warning");
});
socket.on("done",function(topic){
    swal({   title: "Topic finished !!",
    text: "You solved all the scenarios in this topic . would you like to revise what you have solved ?!!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, I wanna!",
    cancelButtonText: "No, choose another topic",
    closeOnConfirm: true,
    closeOnCancel: true },
    function(isConfirm){
        if (isConfirm) {
           sessionStorage.pathogenioustopic=topic;
    window.location.replace("index.html");
            } 
                });
})

socket.on("continue-to-topic",function(topic){
    sessionStorage.pathogenioustopic=topic;
    
    window.location.replace("index.html");
});

socket.on("unfinished.scenario.different.topic",function(send){
     swal({   title: "Unfinished scenario there !!",
    text: "You didn't compelete a scenario in different topic . Do you want to continue solving it ?Be careful!! if you didnt continue solving it , you will lose all the score you got there !!!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, Let me continue that scenario!",
    cancelButtonText: "No, get me a new one",
    closeOnConfirm: true,
    closeOnCancel: true },
    function(isConfirm){
        if (isConfirm) {
        sessionStorage.currentScenarioId=send.scenarioId;
    sessionStorage.currentScenarioTopic=send.scenarioTopic;
    sessionStorage.currentScenarioScore=send.scenarioScore;
    sessionStorage.currentScenarioPosition=send.scenarioPosition;
    sessionStorage.pathogenioustopic=send.scenarioTopic;
        }
        else
        sessionStorage.pathogenioustopic=send.clickedTopic;
    window.location.replace("index.html");
             
                });
});

socket.on("unfinished.scenario.same.topic",function(send){
    sessionStorage.currentScenarioId=send.scenarioId;
    sessionStorage.currentScenarioTopic=send.scenarioTopic;
    sessionStorage.currentScenarioScore=send.scenarioScore;
    sessionStorage.currentScenarioPosition=send.scenarioPosition;
    sessionStorage.pathogenioustopic=send.clickedTopic; 
    window.location.replace("index.html");
})

socket.on("rank.updated",function(user){
 
    sessionStorage.pathogenioususer=JSON.stringify(user);
    loadInfo();
})