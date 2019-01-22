 function slideanim(){
      $(".slideanim").each(function(){
              var pos = $(this).offset().top;
              var winTop = $(window).scrollTop();
              if (pos < winTop + 600) {
                  $(this).addClass("slide");
              }
          });    
    }

    function contact(event){
      var profile = document.getElementById("idProfile");
      var chat = document.getElementById("idChat");
      var main = document.getElementById("idAbout");
      var contact = document.getElementById("idContact");
      //$('.dropdown-content').hide();
     if(!(contact.classList.contains("active"))){
        var $result = $('#result'); 
          $result.load('/contact' ,function (){
          slideanim();
          contactCookieStyle();
      });
      if((chat.classList.contains("active"))){
        chat.classList.toggle("active");
  
      }
      if((main.classList.contains("active"))){
        main.classList.toggle("active");

      }
      if((profile.classList.contains("active"))){
        profile.classList.toggle("active");
      }
        contact.classList.toggle("active");

     // $('.dropdown-content').hide();
      }



      //$('.dropdown-content').hide();
    
    }
    function main(){
      var profile = document.getElementById("idProfile");
      var chat = document.getElementById("idChat");
      var main = document.getElementById("idAbout");
      var contact = document.getElementById("idContact");
      //$('.dropdown-content').hide();
     if(!(main.classList.contains("active"))){
        var $result = $('#result'); 
       $result.load('/main' ,function (){
          slideanim();
          cookieStyle();
      });
      if((chat.classList.contains("active"))){
        chat.classList.toggle("active");

      }
      if((contact.classList.contains("active"))){
        contact.classList.toggle("active");

      }
      if((profile.classList.contains("active"))){
        profile.classList.toggle("active");
      }
        main.classList.toggle("active");

     // $('.dropdown-content').hide();
      }
      
    }
    function chat(){
      var profile = document.getElementById("idProfile");
      var chat = document.getElementById("idChat");
      var main = document.getElementById("idAbout");
      var contact = document.getElementById("idContact");
      if(!(chat.classList.contains("active"))){
        var $result = $('#result'); 
        $result.load('/chat' ,function (){
          slideanim();
          chatCookieStyle(); 
        });
        if((main.classList.contains("active"))){
          main.classList.toggle("active");

        }
        if((contact.classList.contains("active"))){
          contact.classList.toggle("active");

        }
        if((profile.classList.contains("active"))){
          profile.classList.toggle("active");
        }
        chat.classList.toggle("active");

      }
    }
    function profile(){
      var profile = document.getElementById("idProfile");
      var chat = document.getElementById("idChat");
      var main = document.getElementById("idAbout");
      var contact = document.getElementById("idContact");
  
      if(!(chat.classList.contains("active"))){
        var $result = $('#result'); 
        $result.load('/profile' ,function (){
          slideanim();
          chatCookieStyle();
        });
        if((main.classList.contains("active"))){
          main.classList.toggle("active");
        }
        if((contact.classList.contains("active"))){
          contact.classList.toggle("active");
        }
        if((chat.classList.contains("active"))){
          chat.classList.toggle("active");
        }
        profile.classList.toggle("active");
      }
    }

  