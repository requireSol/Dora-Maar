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
  window.location.href = "https://chat.enam.io/#contact";
  var chat = document.getElementById("idChat");
  var main = document.getElementById("idAbout");
  var contact = document.getElementById("idContact");
  var chat2 = document.getElementById("idChat2");
  var main2 = document.getElementById("idAbout2");
  var contact2 = document.getElementById("idContact2");
  //$('.dropdown-content').hide();
  var profile = document.getElementById("idProfile");
  var profile2 = document.getElementById("idProfile2");
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
 
  if((profile.classList.contains("active"))){
    profile.classList.toggle("active");
    profile2.classList.toggle("active");

  }

    contact.classList.toggle("active");
    contact2.classList.toggle("active");

 // $('.dropdown-content').hide();
  }



  //$('.dropdown-content').hide();

}
function about(){
  window.location.href = "https://chat.enam.io/#about";
  var profile = document.getElementById("idProfile");
  var profile2 = document.getElementById("idProfile2");
  var chat = document.getElementById("idChat");
  var main = document.getElementById("idAbout");
  var contact = document.getElementById("idContact");
  var chat2 = document.getElementById("idChat2");
  var main2 = document.getElementById("idAbout2");
  var contact2 = document.getElementById("idContact2");
  //$('.dropdown-content').hide();
 if(!(main.classList.contains("active"))){
    var $result = $('#result'); 
   $result.load('/about' ,function (){
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

  if((profile.classList.contains("active"))){
    profile.classList.toggle("active");
    profile2.classList.toggle("active");

  }

    main.classList.toggle("active");
    main2.classList.toggle("active");
 // $('.dropdown-content').hide();
  }
  
}
function chat(){  
  window.location.href = "https://chat.enam.io/#chat";
  var profile = document.getElementById("idProfile");
  var profile2 = document.getElementById("idProfile2");
  var chat = document.getElementById("idChat");
  var main = document.getElementById("idAbout");
  var contact = document.getElementById("idContact");
  var chat2 = document.getElementById("idChat2");
  var main2 = document.getElementById("idAbout2");
  var contact2 = document.getElementById("idContact2");
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

    if((profile.classList.contains("active"))){
      profile.classList.toggle("active");
      profile2.classList.toggle("active");

    }
  
    chat.classList.toggle("active");
    chat2.classList.toggle("active");

  }
}



function profile(){
  window.location.href = "https://chat.enam.io/#profile";
  var profile = document.getElementById("idProfile");
  var profile2 = document.getElementById("idProfile2");
  var chat = document.getElementById("idChat");
  var main = document.getElementById("idAbout");
  var contact = document.getElementById("idContact");
  var chat2 = document.getElementById("idChat2");
  var main2 = document.getElementById("idAbout2");
  var contact2 = document.getElementById("idContact2");
  if(!(profile.classList.contains("active"))){
    var $result = $('#result'); 
    $result.load('/profile' ,function (){
      slideanim();
      //chatCookieStyle(); 
    });
    if((main.classList.contains("active"))){
      main.classList.toggle("active");
      main2.classList.toggle("active");

    }
    if((contact.classList.contains("active"))){
      contact.classList.toggle("active");
      contact2.classList.toggle("active");

    }

    if((chat.classList.contains("active"))){
      chat.classList.toggle("active");
      chat2.classList.toggle("active");
    }
    profile.classList.toggle("active");
    profile2.classList.toggle("active");

  }
}

