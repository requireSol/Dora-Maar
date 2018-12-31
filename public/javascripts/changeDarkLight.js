/*
*
* change from Darkmode to Lightmode
*
*/

function changeStyle() {
    var nav = document.getElementById("navbar");
    var logo = document.getElementById("logo");
    var navul = document.getElementById("navul");
    var myDropdown = document.getElementById("myDropdown");
    var block1 = document.getElementById("block1"); 
    var block2 = document.getElementById("block2"); 
    var block3 = document.getElementById("block3");
    var footer = document.getElementById("footer");
    if(document.getElementById("navbar").style.backgroundColor == "white"){
        nav.style.background = "#303851";
        
        logo.style.background = "#303851";
        logo.style.color = "white";
        
        navul.style.background = "#303851";
        navul.style.color = "white";
        
        myDropdown.style.background = "#303851";
        myDropdown.style.color = "white";
        myDropdown.style.color = "white";
        
        block1.style.background ="#303851";
        block1.style.color ="white";
        block3.style.background ="#303851";
        block3.style.color ="white";

        block2.style.background = "#363e55"
        block2.style.color ="white";

        footer.style.background = "#363e55";
        footer.style.color ="white";
        
    }else{
        
        nav.style.background = "white";
        
        logo.style.background = "white";
        logo.style.color = "black";
        
        navul.style.background = "white";
        navul.style.color = "black";
        
        myDropdown.style.background = "white";
        myDropdown.style.color = "black";
        
        block1.style.background ="white";
        block1.style.color ="black";
        block3.style.background ="white";
        block3.style.color ="black";

        block2.style.background ="#fcfcfc";
        block2.style.color ="black";

        footer.style.background = "#65acc2";
        footer.style.color ="white";

    }
}
