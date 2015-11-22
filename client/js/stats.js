var socket=io();
$(function(){
    socket.emit("get.all.users");
});

socket.on("receive.all.users",function(users){
    console.log("users size is "+users.length)
    genetics(users);
    
    
})

function genetics(users)
    {
    var gcount=1;
    var ungcount=1;
    for(var i = 0 ; i <users.length ; i++){
        if(users[i].gamified==true)
        {
            var table= $(".genetics-stats-gamified");
            table.append("<tr>");
            table.append("<td>"+(gcount)+"</td>");
             table.append("<td>"+(users[i].tutorial)+"</td>");
             table.append("<td>"+(users[i].displayName)+"</td>");
             table.append("<td>"+(users[i].geneticsScore)+"</td>");
             table.append("<td>"+(users[i].geneticsLevel)+"</td>");
             table.append("<td>"+(users[i].correctScenariosGenetics)+"</td>");
             table.append("<td>"+(users[i].correctQuestionsGenetics/users[i].answeredQuestionsGenetics*100)+"%</td>");
               table.append("<td>"+(users[i].totalScore)+"</td>");
                table.append("<td>"+(users[i].rank)+"</td>");
               table.append("</tr>");
               
            gcount++;
        }
        else
        {
            var t=$(".genetics-stats-ng");
            t.append("<tr>");
            t.append("<td>"+ungcount+"</td>");
            t.append("<td>"+users[i].tutorial+"</td>");
            t.append("<td>"+users[i].displayName+"</td>");
            t.append("<td>"+users[i].correctScenariosGenetics+"</td>");
            t.append("</tr");
            ungcount++;
        }
    }
}