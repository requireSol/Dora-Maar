var signIn = document.getElementById("signIn");
var signUp = document.getElementById("signUp");

        signIn.onclick = function(){
            var nameSignIn = document.getElementById("nameSignIn");
            var passwordSignIn = document.getElementById("passwordSignIn");
            
            var name = nameSignIn.value;
            var pw = passwordSignIn.value;
            if(name != "" && pw != "")
            socket.emit('signIn',{username:name,password:pw});
            else
            $.notify("All fields Required !", "warn");
        }
        signUp.onclick = function(){
          var emailSignUp = document.getElementById("emailSignUp");
            var nameSignUp = document.getElementById("nameSignUp");
            var passwordSignUp = document.getElementById("passwordSignUp");
            var passwordConfSignUp = document.getElementById("passwordConfSignUp");  
            socket.emit('signUp',{email:emailSignUp.value,username:nameSignUp.value,password:passwordSignUp.value,conf:passwordConfSignUp.value});
            
      }