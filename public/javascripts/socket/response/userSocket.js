function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
}
}

 socket.on('signInResponse',function(data){
  if(data.success){
    $.notify("Successfully Logged in!", "success");
    wait(1000);
    window.location.href = "https://chat.enam.io/#profile"; 
    location.reload();
  } else{
    $.notify("Password or Username wrong !", "error");
  }
});
socket.on('signUpResponse',function(data){
  if(data.success){
    $.notify("Successfully Registered! You will be Logged in", "success");
    wait(1000);
    window.location.href = "https://chat.enam.io/#profile"; 
    location.reload();
    } else{
     $.notify("Sign Up Failed!", "error");
    }
});
      