 $(document).ready(function() {
          $('#comment_form').submit(function() {
               //get Input Variable
            $(this).ajaxSubmit({
              error: function(xhr) {
                status('Error: ' + xhr.status);
              },
             success: function(response) {
                var name = document.getElementById('name').value
                var email = document.getElementById('email').value
                var comments = document.getElementById('comments').value
                event.preventDefault();
                var data = "" + name + ":" + email + ":" + comments + "";
    
                if(response['responseCode'] == 1){
                        $.notify("Failed reCaptcha !");
                }else{
                    socket.emit('telegrammMessage', data);
                    document.getElementById('name').value = "";
                    document.getElementById('email').value = "";
                    document.getElementById('comments').value = "";
                    $("#recap").fadeOut();
                    $.notify("Message send successfully", "success");
                }
             }
            });
            //Very important line, it disable the page refresh.
            return false;
          });
        });