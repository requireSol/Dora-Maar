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
    var id1 = document.getElementById("id1");
    var id2 = document.getElementById("id2");
    var id3 = document.getElementById("id3");
    var id4 = document.getElementById("id4");
    var id5 = document.getElementById("id5");
    var id6 = document.getElementById("id6");
    var id7 = document.getElementById("id7");
    var id8 = document.getElementById("id8");
    var id9 = document.getElementById("id9");
    var signin = document.getElementById("formsignin");
    var signin2 = document.getElementById("formsignin2");  
    var signup = document.getElementById("formsignup");
    var signup2 = document.getElementById("formsignup2");
    if(document.cookie == "style=black"){
        document.cookie = "style=black; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        nav.style.background = "#303851";
        title.style.background = "#303851";
        title.style.color = "white";
        navul.style.background = "#303851";
        navul.style.color = "white";
        id1.style.background = "#303851";
        id1.style.color = "white";
        id2.style.background = "#303851";
        id2.style.color = "white";
        id3.style.background = "#303851";
        id3.style.color = "white";
        id4.style.background = "#303851";
        id4.style.color = "white";
        id5.style.background = "#303851";
        id5.style.color = "white";
        id6.style.background = "#303851";
        id6.style.color = "white";
        //id7.style.background = "#303851";
       // id7.style.color = "white";
       // id8.style.background = "#303851";
       // id8.style.color = "white";
       // id9.style.background = "#303851";
       // id9.style.color = "white";
      //  id10.style.background = "#303851";
      //  id10.style.color = "white";
        signin.style.background = "#303851";
        signin.style.color = "white";
        signin2.style.background = "rgb(54, 62, 85)";
        signin2.style.color = "white";
        signup.style.background = "#303851";
        signup.style.color = "white";
        signup2.style.background = "rgb(54, 62, 85)";
        signup2.style.color = "white";
        myDropdown.style.background = "#303851";
        myDropdown.style.color = "white";
    }else{
        document.cookie = "style=white; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        nav.style.background = "white";
        navul.style.background = "white";
        navul.style.color = "black";
        id1.style.background = "white";
        id1.style.color = "black";
        id2.style.background = "white";
        id2.style.color = "black";
        id3.style.background = "white";
        id3.style.color = "black";
        id4.style.background = "white";
        id4.style.color = "black";
        id5.style.background = "white";
        id5.style.color = "black";
        id6.style.background = "white";
        id6.style.color = "black";
       // id7.style.background = "white";
        //id7.style.color = "black";
       // id8.style.background = "white";
       // id8.style.color = "black";
       // id9.style.background = "white";
       // id9.style.color = "black";
       // id10.style.background = "white";
        //id10.style.color = "black";
        signin2.style.background = "white";
        signin2.style.color = "black";
        signin.style.background = "white";
        signin.style.color = "black";
        signup.style.background = "white";
        signup.style.color = "black";
        signup2.style.background = "white";
        signup2.style.color = "black";
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
    //var block2 = document.getElementById("block2"); 
    //var block3 = document.getElementById("block3");
   
    if(document.cookie == "style=black"){
        
        //block2.style.background ="#303851";
        //block2.style.color ="white";
        main.style.background ="#303851";
        main.style.color ="white";
    }else{
       // block2.style.background ="white";
       // block2.style.color ="black";  
        main.style.background ="white";
        main.style.color ="black";

    }
}

function chatCookieStyle(){
    var logo = document.getElementById("logo");
    var values = document.getElementById("chat"); 
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
        }else if(document.getElementById("chat") !== null){
            chatCookieStyle();
        }
        footerCookieStyle();
    }else{
   
        document.cookie = "style=white; expires=Thu, 18 Dec 2019 12:00:00 UTC";
        headerCookieStyle();
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
