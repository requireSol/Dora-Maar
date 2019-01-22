  $(document).ready(function() {
		$('#chatform').on('submit', function (event) {
			event.preventDefault();
			socket.emit('chatMessage' , $('#message').val());
      $('#message').val('');
		});
 });