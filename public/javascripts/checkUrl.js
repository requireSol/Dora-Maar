   $(document).ready(function () {
          

      if(window.location.href.indexOf("#contact") > -1) {
            contact();
          }
          else if(window.location.href.indexOf("#about") > -1) {
            main();
          }else if(window.location.href.indexOf("#chat") > -1) {
            chat();
          }else{
              main();
          }
        
      });