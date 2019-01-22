var signIn = document.getElementById("signIn");
var sigUp = document.getElementById("signUp");

        signIn.onclick = function(){
            var nameSignIn = document.getElementById("nameSignIn");
            var passwordSignIn = document.getElementById("passwordSignIn");   
            var name = nameSignIn.value;
            var pw = passwordSignIn.value;
            socket.emit('signIn',{username:name,password:pw});
        }
        signUp.onclick = function(){
          var emailSignUp = document.getElementById("emailSignUp");
            var nameSignUp = document.getElementById("nameSignUp");
            var passwordSignUp = document.getElementById("passwordSignUp");
            var passwordConfSignUp = document.getElementById("passwordConfSignUp");  

            socket.emit('signUp',{email:emailSignUp.value,username:nameSignUp.value,password:passwordSignUp.value,conf:passwordConfSignUp.value});
  }