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
      var chat = document.getElementById("id2");
      var chat2 = document.getElementById("id5");
      var main = document.getElementById("id1");
      var main2 = document.getElementById("id4");
      var contact = document.getElementById("id3");
      var contact2 = document.getElementById("id6");
      //$('.dropdown-content').hide();
     if(!(contact.classList.contains("active"))){
        var $result = $('#result'); 
          $result.load('/contact' ,function (){
          slideanim();
          contactCookieStyle();
      });
      if((chat.classList.contains("active"))){
        chat.classList.toggle("active");
        chat2.classList.toggle("active");
      }
      if((main.classList.contains("active"))){
        main.classList.toggle("active");
        main2.classList.toggle("active");
      }
        contact.classList.toggle("active");
        contact2.classList.toggle("active");
     // $('.dropdown-content').hide();
      }



      //$('.dropdown-content').hide();
    
    }
    function main(){
      var chat = document.getElementById("id2");
      var chat2 = document.getElementById("id5");
      var main = document.getElementById("id1");
      var main2 = document.getElementById("id4");
      var contact = document.getElementById("id3");
      var contact2 = document.getElementById("id6");
      //$('.dropdown-content').hide();
     if(!(main.classList.contains("active"))){
        var $result = $('#result'); 
       $result.load('/main' ,function (){
          slideanim();
          cookieStyle();
      });
      if((chat.classList.contains("active"))){
        chat.classList.toggle("active");
        chat2.classList.toggle("active");
      }
      if((contact.classList.contains("active"))){
        contact.classList.toggle("active");
        contact2.classList.toggle("active");
      }
        main.classList.toggle("active");
        main2.classList.toggle("active");
     // $('.dropdown-content').hide();
      }
      
    }
    function chat(){
      var chat = document.getElementById("id2");
      var chat2 = document.getElementById("id5");
      var main = document.getElementById("id1");
      var main2 = document.getElementById("id4");
      var contact = document.getElementById("id3");
      var contact2 = document.getElementById("id6");
      if(!(chat.classList.contains("active"))){
        var $result = $('#result'); 
        $result.load('/chat' ,function (){
          slideanim();
          chatCookieStyle();
          
        });
        if((main.classList.contains("active"))){
          main.classList.toggle("active");
          main2.classList.toggle("active");
        }
        if((contact.classList.contains("active"))){
          contact.classList.toggle("active");
          contact2.classList.toggle("active");
        }
        chat.classList.toggle("active");
        chat2.classList.toggle("active");
      }
    }

  