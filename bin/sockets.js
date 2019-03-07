/*If you use socket.emit it will change this->socket if you do io.sockets.emit everyone get the message
as example
 io.sockets.emit('newMessage', {msg: data});	
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
var validator = require("email-validator");
var sharedsession = require("express-socket.io-session");
const request = require('request');	
var crypto = require('crypto');
var mongojs = require("mongojs");
var db = mongojs('localhost:27017/myGame', ['account','progress']);

 /**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword , salt) {
    var passwordData = sha512(userpassword, salt);
    return [userpassword, passwordData.passwordHash, passwordData.salt];
}


var isValidPassword = function(data,cb){
    db.account.findOne({username:data.username}, function(err, res) {
        if (err) throw cb(false);
        if(res != null){
            var salt = res.salt;
            var hash = saltHashPassword(data.password, salt)[1];
                if(res.password === hash){
                    cb(true);
                }else{
                    cb(false);
                }
        }else{
            cb(false);
        }
    });
}

var isEmailTaken = function(data,cb){
    db.account.find({email:data.email},function(err,res){
      if(res.length > 0)
          cb(true);
      else
          cb(false);
      });
}

var addUser = function(data,cb){
    var salting = genRandomString(16);
    var hash = saltHashPassword(data.password, salting)[1];
    db.account.insert({email:data.email,username:data.username,password:hash,salt:salting},function(err){
        cb();
    });
}



module.exports = function(io , session) {

io.use(sharedsession(session, {
    autoSave:true
}));
    var userConnections = [];

 io.sockets.on('connection', function(socket){

     var id = socket.handshake.session.id;
     var existingUser = userConnections.find(function(userConnection){
         return userConnection.id === id;
     });

     if (!existingUser){
         existingUser = {
             id: id,
             sockets: []
         }
         userConnections.push(existingUser);
     }

     existingUser.sockets.push(socket);
     console.log(userConnections.length + " Users Connected");
     console.log('One User is connected with  %s Sockets', existingUser.sockets.length);
     console.log(userConnections);

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
      console.log("Message send: " + data);
      request('https://api.telegram.org/bot719913903:AAF-WjF99Il1wV7bHwzKiCAVk-yUo6wDvs0/sendMessage?chat_id=305873350&text=Chat Message:' +  data, { json: true }, (err, res, body) => {	
        if (err) { return console.log(err); }		
        });	
        io.sockets.emit('showMessage', {msg: data});	
      });	

    socket.on('signIn',function(data){
        isValidPassword(data,function(res){
            if(res){
                socket.handshake.session.userdata = data;
                socket.handshake.session.save();
                test = new Ressourcen(0,0,0,0,0);
                socket.emit('signInResponse',{response:true});
            } else {
                socket.emit('signInResponse',{response:false});         
            }
        });
    });

    socket.on('signUp',function(data){
        isEmailTaken(data,function(res){
            if (data.username === "" || data.password === "" || data.password === "" || data.conf === "" ) {
                socket.emit('signUpResponse',{response:"required"});   
            }else{
            if(res){
                socket.emit('signUpResponse',{response:"emailTaken"});     
            } else if (data.conf != data.password){
                socket.emit('signUpResponse',{response:"pwDontMatch"});
            } else if(!(validator.validate(data.email))){
                socket.emit('signUpResponse',{response:"emailWrong"}); 
            }else{
                socket.handshake.session.userdata = data;
                socket.handshake.session.save();
                addUser(data,function(){
                    socket.emit('signUpResponse', {response:"true"});                
                });   
                test = new Ressourcen(0,0,0,0,0);
            }}
        
        });  
   });
   socket.on("logout", function() {
    if (socket.handshake.session.userdata) {
        delete socket.handshake.session.userdata;
        socket.handshake.session.save();
        test = null;
    }
});



   socket.on('disconnect',function(){
       existingUser.sockets.splice(existingUser.sockets.indexOf(socket), 1);
       if (existingUser.sockets.length === 0) {
           if (userConnections) {
               console.log(userConnections);
               userConnections.splice(userConnections.indexOf(existingUser.id), 1);
               console.log('User disconnected: Online %s', userConnections.length);
               
           }
       } else {
           console.log("User closed a Tab");
       }
   });

    socket.on('evalServer',function(data){
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer',res);     
    });

});

};



