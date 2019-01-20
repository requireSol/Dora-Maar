 /**	
 * Module dependencies.	
 */	

var app = require('../app').app;	
var debug = require('debug')('rase.io:server');	
var http = require('http');	
var https = require('https');	
var fs = require('fs');	
const request = require('request');	


 /**	
 * Get port from environment and store in Express.	
 */	

 var port = normalizePort(process.env.PORT || '443');	
app.set('port', port);	

 // Certificate	
const privateKey = fs.readFileSync('/etc/letsencrypt/live/chat.enam.io/privkey.pem', 'utf8');	
const certificate = fs.readFileSync('/etc/letsencrypt/live/chat.enam.io/cert.pem', 'utf8');	
const ca = fs.readFileSync('/etc/letsencrypt/live/chat.enam.io/chain.pem', 'utf8');	

 const credentials = {	
	key: privateKey,	
	cert: certificate,	
	ca: ca	
};	

// Starting both http & https servers	
//var server = https.createServer(credentials, app);	

 http.createServer(function (req, res) {	
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });	
    res.end();	
}).listen(80);	
/*	
const server = https.listen(443,() => {	
	console.log('HTTPS Server running on port 443');	
});	
*/	
/**	
 * Listen on provided port, on all network interfaces.	
 */	

 var server = https.createServer(credentials, app);	
server.listen(port);

var SOCKET_LIST = {};

var DEBUG = true;
 
var isValidPassword = function(data,cb){
    db.account.find({username:data.username,password:data.password},function(err,res){
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}
var isUsernameTaken = function(data,cb){
    db.account.find({username:data.username},function(err,res){
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}
var addUser = function(data,cb){
    console.log(data.username);
    db.account.insert({username:data.username,password:data.password},function(err){
        cb();
    });
}
 


 var io = require('socket.io')(server,{});	

user = [];	

 io.sockets.on('connection', function(socket){	

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

   //Connect	
   /* connections.push(socket)	
    console.log('socket connection %s', connections.length);	

     //Listen to event "disconnect"	
    socket.on('disconnect',function(data){	
        //Disconnect	
        connections.splice(connections.indexOf(socket), 1);	
        console.log('socket disconnection %s' , connections.length);	
    });	
*/
     //Send Telegramm Message	
    socket.on('telegrammMessage', function(data){	
      data = data.split(":");	
      request('https://api.telegram.org/bot719913903:AAF-WjF99Il1wV7bHwzKiCAVk-yUo6wDvs0/sendMessage?chat_id=305873350&text=Name:' +  data[0] + 'Email:' + data[1] + 'Comment: ' + data[2], { json: true }, (err, res, body) => {	
        if (err) { return console.log(err); }		
      });	
      io.sockets.emit('newMessage', {msg: data});	
    });	
      //Send Telegramm Message	
    socket.on('chatMessage', function(data){	
      console.log("Message send: ");
      console.log(data);
      request('https://api.telegram.org/bot719913903:AAF-WjF99Il1wV7bHwzKiCAVk-yUo6wDvs0/sendMessage?chat_id=305873350&text=Chat Message:' +  data, { json: true }, (err, res, body) => {	
        if (err) { return console.log(err); }		
        });	
        io.sockets.emit('showMessage', {msg: data});	
      });	

    socket.on('signIn',function(data){
        isValidPassword(data,function(res){
            if(res){
            //    Player.onConnect(socket);
                socket.emit('signInResponse',{success:true});
            } else {
                socket.emit('signInResponse',{success:false});         
            }
        });
    });
    socket.on('signUp',function(data){
        //connections.push(socket)	
         //console.log('socket connection %s', connections.length);
    
        isUsernameTaken(data,function(res){
            if(res){
                socket.emit('signUpResponse',{success:false});     
            } else {
                addUser(data,function(){
                    socket.emit('signUpResponse',{success:true});                  
                });
            }
        });  
   });	
   socket.on('disconnect',function(){
    //connections.splice(connections.indexOf(socket), 1);	
    //console.log('socket disconnection %s' , connections.length);
    delete SOCKET_LIST[socket.id];
       // Player.onDisconnect(socket);

    });

    socket.on('evalServer',function(data){
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer',res);     
    });
});
 //var server = require('../app').server;	


console.log("Started on Port " + port);	
server.on('error', onError);	
server.on('listening', onListening);	

 /**	
 * Normalize a port into a number, string, or false.	
 */	

 function normalizePort(val) {	
  var port = parseInt(val, 10);	

   if (isNaN(port)) {	
    // named pipe	
    return val;	
  }	

   if (port >= 0) {	
    // port number	
    return port;	
  }	

   return false;	
}	

 /**	
 * Event listener for HTTP server "error" event.	
 */	

 function onError(error) {	
  if (error.syscall !== 'listen') {	
    throw error;	
  }	

   var bind = typeof port === 'string'	
    ? 'Pipe ' + port	
    : 'Port ' + port;	

   // handle specific listen errors with friendly messages	
  switch (error.code) {	
    case 'EACCES':	
      console.error(bind + ' requires elevated privileges');	
      process.exit(1);	
      break;	
    case 'EADDRINUSE':	
      console.error(bind + ' is already in use');	
      process.exit(1);	
      break;	
    default:	
      throw error;	
  }	
}	

 /**	
 * Event listener for HTTP server "listening" event.	
 */	

 function onListening() {	
  var addr = server.address();	
  var bind = typeof addr === 'string'	
    ? 'pipe ' + addr	
    : 'port ' + addr.port;	
  debug('Listening on ' + bind);	
}	
 exports.server = server;