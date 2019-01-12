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


function cookieStyle(){
    var logo = document.getElementById("logo");
    var block1 = document.getElementById("block1"); 
    var block2 = document.getElementById("block2"); 
    var block3 = document.getElementById("block3");
   
    if(document.cookie == "style=black"){
        
        block1.style.background ="#303851";
        block1.style.color ="white";
        /*block3.style.background ="#303851";
        block3.style.color ="white";

        block2.style.background = "#363e55"
        block2.style.color ="white";*/
        //logo.style.background = "rgb(54, 62, 85)";
        
    }else{
        
        block1.style.background ="white";
        block1.style.color ="black";
        /*block3.style.background ="white";
        block3.style.color ="black";

        block2.style.background ="#fcfcfc";
        block2.style.color ="black";*/
       // logo.style.background = "white";

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
        console.log("WTF");
        cookieStyle();
        footerCookieStyle();
    }else{
   
        document.cookie = "style=white; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        headerCookieStyle();
        cookieStyle();
        footerCookieStyle();
    }

}
