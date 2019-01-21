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
        contact.style.background ="#303851";
        contact.style.color ="white";
    }else{
        contact.style.background ="white";
        contact.style.color ="black";
    }

}

function cookieStyle(){
    var main = document.getElementById("main"); 
   
    if(document.cookie.includes("style=black")){
        main.style.background ="#303851";
        main.style.color ="white";
    }else{
        main.style.background ="white";
        main.style.color ="black";

    }
}

function chatCookieStyle(){
    var values = document.getElementById("chat"); 

    if(document.cookie.includes("style=black")){
        values.style.background ="#303851";
        values.style.color ="white";
    }else{
        values.style.background ="white";
        values.style.color ="black";

    }
}

function footerCookieStyle(){
    var footer = document.getElementById("footer");
    if(document.cookie.includes("style=black")){
       
        footer.style.background = "#363e55";
        footer.style.color ="white";
    }else{
        footer.style.background = "#65acc2";
        footer.style.color ="white";
    }
}


function changeStyle(){
    
    if(document.getElementById("header").style.backgroundColor == "white"){
        
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
