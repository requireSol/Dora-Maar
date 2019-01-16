
 
/**NAVBAR FUNCTIONALITYS*/

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
/*function dropDownToogle() {
    document.getElementById("myDropdown").classList.toggle("show");
    $('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function(){
		$(this).toggleClass('open');
	});
    //$(".dropbtn").click(function(){
    //  $("dropdown-content").fadeIn()
   // });
  }*/
  
  // Close the dropdown if the user clicks outside of it
  
  $(document).ready(function(){
	$('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function(){
      document.getElementById("myDropdown").setAttribute("class", "show"); 
      $(this).toggleClass('open');
	});
});



   // Get the modal
   var modal = document.getElementById('signin');
   var modal2 = document.getElementById('signup');
   
   // When the user clicks anywhere outside of the modal or dropdown, close it
   window.onclick = function(event) {
       if (event.target == modal) {
           modal.style.display = "none";
       }else if(event.target == modal2){
         modal2.style.display = "none";
   }

     if (!(event.target.matches('.dropdown'))) {}
         if (($( "#myDropdown" ).hasClass( "show" ))) {
           document.getElementById("myDropdown").setAttribute("class" , "show");
           $(this).toggleClass('open');
           //console.log("gg");
         }else{
          document.getElementById("myDropdown").setAttribute("class" , "dropdown-content");
          $(this).toggleClass('open');
         }
   }
 

    