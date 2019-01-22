socket.on('showMessage', function (data){
    var message = $('.message').last().clone();
      const heute = new Date();
   //Find an rewrite text
       message.find('.datetime').text(heute.getDate() + "." + heute.getUTCMonth() + "1." + heute.getFullYear() + " " + heute.getHours() + ":" + heute.getMinutes());
       message.find('p').text(data.msg);
       $('.chat-container').append(message);
       //message.hide();
       //message.fadeIn();
       $(".chat-container").animate({ scrollTop: $('.chat-container').prop("scrollHeight")}, 0);
       //setTimeout(function(){ console.log("time out") }, 3000);
      message.addClass("w3-animate-right")
       slideanim();
 });