function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
	}
}

function slideanim(){
     $(".slideanim").each(function(){
             var pos = $(this).offset().top;
             var winTop = $(window).scrollTop();
             if (pos < winTop + 600) {
               $(this).addClass("slide");
               
             }
         });    
   }