/*
*
* change from Darkmode to Lightmode
*
*/

function headerCookieStyle(){
    var nav = document.getElementById("navbar");
    var navul = document.getElementById("navul");
    var myDropdown = document.getElementById("myDropdown");
    var title = document.getElementById("title");
    if(document.cookie == "style=black"){
        document.cookie = "style=black; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        nav.style.background = "#303851";
        title.style.background = "#303851";
        title.style.color = "white";
        navul.style.background = "#303851";
        navul.style.color = "white";
        myDropdown.style.background = "#303851";
        myDropdown.style.color = "white";
    }else{
        document.cookie = "style=white; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        nav.style.background = "white";
        navul.style.background = "white";
        navul.style.color = "black";
        myDropdown.style.background = "white";
        myDropdown.style.color = "black";
        title.style.background = "white";
        title.style.color ="black";
    }
}

function contactCookieStyle(){
    var block3 = document.getElementById("contact");
    if(document.cookie == "style=black"){
        block3.style.background ="#303851";
        block3.style.color ="white";
    }else{
        block3.style.background ="white";
        block3.style.color ="black";
    }

}

function cookieStyle(){
    var logo = document.getElementById("logo");
    var main = document.getElementById("main"); 
    var block2 = document.getElementById("block2"); 
    //var block3 = document.getElementById("block3");
   
    if(document.cookie == "style=black"){
        
        main.style.background ="#303851";
        main.style.color ="white";
        
    }else{
        
        main.style.background ="white";
        main.style.color ="black";

    }
}

function valuesCookieStyle(){
    var logo = document.getElementById("logo");
    var values = document.getElementById("values"); 
    var block2 = document.getElementById("block2"); 
    //var block3 = document.getElementById("block3");
   
    if(document.cookie == "style=black"){
        
        values.style.background ="#303851";
        values.style.color ="white";
        
    }else{
        
        values.style.background ="white";
        values.style.color ="black";

    }
}

function footerCookieStyle(){
    var footer = document.getElementById("footer");
    if(document.cookie == "style=black"){
       
        footer.style.background = "#363e55";
        footer.style.color ="white";
    }else{
        footer.style.background = "#65acc2";
        footer.style.color ="white";
    }
}


function changeStyle(){
    if(document.getElementById("navbar").style.backgroundColor == "white"){
        
        document.cookie = "style=black; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        headerCookieStyle(); 
        
        //If else include for contactCookieStyle id content existing or not 
        if(document.getElementById("contact") !== null){
            contactCookieStyle();
        }else if(document.getElementById("main") !== null){
            cookieStyle();
        }else if(document.getElementById("values") !== null){
            valuesCookieStyle();
        }
        footerCookieStyle();
    }else{
   
        document.cookie = "style=white; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        headerCookieStyle();
        if(document.getElementById("contact") !== null){
            contactCookieStyle();
        }else if(document.getElementById("main") !== null){
            cookieStyle();
        }else if(document.getElementById("values") !== null){
            valuesCookieStyle();
        }
        footerCookieStyle();
    }

}
