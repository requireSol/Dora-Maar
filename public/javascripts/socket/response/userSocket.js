/** Hier Ganz Normal document ready submit machen*/

 socket.on('signInResponse',function(data){
  if(data.response){
    $.notify("Successfully Logged in!", "success");
    wait(1000);
    window.location.href = "https://enam.io/#profile";
    location.reload();
  } else{
    $.notify("Password or Username wrong !", "error");
  }
  
});
socket.on('signUpResponse',function(data){

    if(data.response === "true"){
    $.notify("Successfully Registered! You will be Logged in", "success");
    wait(1000);
    window.location.href = "https://enam.io/#profile";
    location.reload();
    } 
    else if (data.response === "required"){
      $.notify("All fields required!", "warn");
    }
    else if (data.response === "emailTaken"){
      $.notify("Email adress alrdy registred!", "warn");
    }
    else if (data.respons = "emailWrong"){
      $.notify("Pls use a valid Email!", "warn");
    }
    else if (data.response === "pwDontMatch"){
      $.notify("Passwords dont match!", "warn");
    }else{
      $.notify("Something went wrong !", "error");
    }
});
      