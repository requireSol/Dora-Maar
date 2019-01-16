var count = 0;
//count added for ignoring first click


function toogleDropdown(){
  document.getElementById("myDropdown").classList.toggle("show");
  $('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').toggleClass('open');
  count = 0;
}


// Get the modal
var modal = document.getElementById('signin');
var modal2 = document.getElementById('signup');

// When the user clicks anywhere outside of the modal or dropdown, close it
var modal = document.getElementById('signin');
var modal2 = document.getElementById('signup');

// When the user clicks anywhere outside of the modal or dropdown, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }else if(event.target == modal2){
      modal2.style.display = "none";
     }
    if (!event.target.matches('.dropdown')) {
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  //klappt wenn bisschen an classen getrickst wird
  for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      //das darf nicht das erste mal aufgerufen weden da es das gezeigte direkt versteckt
      if(count != 0){
      openDropdown.classList.remove('show');
      $('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').toggleClass('open');
      }
      count++;
      //$(this).toggleClass('open');
      //toogleDropdown();
    }
  }
}
}