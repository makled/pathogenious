var socket = io();
$(".forgot_password").on('click',function(){
    var email=$("#emailInput").val();
    console.log("sending event with val "+email);
    socket.emit("check-username",email);
});

socket.on('no-username',function(){
    console.log("entered err step");
    swal("ERR!", "this user name isn't registered for this app!!", "error");
});

socket.on('found-username',function(name){
    console.log("sending request to reset password.....");
    socket.emit("send-password",name);
})

socket.on("reset-complete",function(){
    console.log("received password reset confirmation");
    swal("Done!!","your PathoGenius password has been sent to your GUC e-mail","success");
})