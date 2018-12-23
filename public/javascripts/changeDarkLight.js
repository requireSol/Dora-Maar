/*
*
* change from Darkmode to Lightmode
*
*/

function changeStyle() {
    var nav = document.getElementById("navbar");
    var logo = document.getElementById("logo");
    var navul = document.getElementById("navul");
    if(document.getElementById("navbar").style.backgroundColor == "white"){
        nav.style.background = "#303851";
        logo.style.background = "#303851";
        logo.style.color = "white";
        navul.style.background = "#303851";
      
    }else{
        nav.style.background = "white";
        logo.style.background = "white";
        logo.style.color = "black";
        navul.style.background = "white";
        navul.style.color = "black";
    }
}
