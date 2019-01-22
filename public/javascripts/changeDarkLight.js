/*
*
* change from Darkmode to Lightmode
*
*/

var colorDark = "#303851" ;
var colorWhite = "white";
var colorBlack = "black";

function headerCookieStyle(){
    var header = document.getElementById("header"); 

    var signin = document.getElementById("formsignin"); 
    var signup = document.getElementById("formsignup"); 
   var myDropdown = document.getElementById("myDropdown"); 

    if(document.cookie.includes("style=black")){
        document.cookie = "style=black; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        header.style.background = colorDark;
        header.style.color = colorWhite;
        signin.style.background = colorDark;
        signin.style.color = colorWhite;
        signup.style.background = colorDark;
        signup.style.color = colorWhite;
        myDropdown.style.background = colorDark;
        myDropdown.style.color = colorWhite;
    }else{
        document.cookie = "style=white; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        header.style.background = colorWhite;
        header.style.color = colorBlack;
        signin.style.background = colorWhite;
        signin.style.color = colorBlack;
        signup.style.background = colorWhite;
        signup.style.color = colorBlack;
      myDropdown.style.background = colorWhite;
      myDropdown.style.color = colorBlack;
    }
}

function headerProfileCookieStyle(){
    var header = document.getElementById("header"); 
   var myDropdown = document.getElementById("myDropdown"); 

    if(document.cookie.includes("style=black")){
        document.cookie = "style=black; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        header.style.background = colorDark;
        header.style.color = colorWhite;
        myDropdown.style.background = colorDark;
        myDropdown.style.color = colorWhite;
    }else{
        document.cookie = "style=white; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        header.style.background = colorWhite;
        header.style.color = colorBlack;
        myDropdown.style.background = colorWhite;
        myDropdown.style.color = colorBlack;
    }
}

function contactCookieStyle(){
    var contact = document.getElementById("contact");
    if(document.cookie.includes("style=black")){
        contact.style.background =colorDark;
        contact.style.color =colorWhite;
    }else{
        contact.style.background =colorWhite;
        contact.style.color =colorBlack;
    }

}

function cookieStyle(){
    var main = document.getElementById("main"); 
   
    if(document.cookie.includes("style=black")){
        main.style.background =colorDark;
        main.style.color =colorWhite;
    }else{
        main.style.background =colorWhite;
        main.style.color =colorBlack;

    }
}

function chatCookieStyle(){
    var values = document.getElementById("chat"); 

    if(document.cookie.includes("style=black")){
        values.style.background =colorDark;
        values.style.color =colorWhite;
    }else{
        values.style.background =colorWhite;
        values.style.color =colorBlack;

    }
}

function footerCookieStyle(){
    var footer = document.getElementById("footer");
    if(document.cookie.includes("style=black")){
       
        footer.style.background = "#363e55";
        footer.style.color =colorWhite;
    }else{
        footer.style.background = "#65acc2";
        footer.style.color =colorWhite;
    }
}


function changeStyle(){
    
    if(document.getElementById("header").style.backgroundColor == colorWhite){
        
        document.cookie = "style=black; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        if(document.getElementById("logged") !== null){
            headerProfileCookieStyle(); 
        }else{
            console.log("Klick");
            headerCookieStyle(); 
        }
        //If else include for contactCookieStyle id content existing or not 
        if(document.getElementById("contact") !== null){
            contactCookieStyle();
        }else if(document.getElementById("main") !== null){
            cookieStyle();
        }else if(document.getElementById("chat") !== null){
            chatCookieStyle();
        }
        footerCookieStyle();
    }else{
   
        document.cookie = "style=white; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        if(document.getElementById("logged") !== null){
            headerProfileCookieStyle(); 
        }else{
            headerCookieStyle(); 
        }
        if(document.getElementById("contact") !== null){
            contactCookieStyle();
        }else if(document.getElementById("main") !== null){
            cookieStyle();
        }else if(document.getElementById("chat") !== null){
            chatCookieStyle();
        }
        footerCookieStyle();
    }

}
