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
    var connections = [];
    var DEBUG = true;
    var test =null;

    function Ressourcen(id, metall, kristall, deuterium, hParticle) {
        this.id = id;
        this.metall = metall;
        this.kristall = kristall;
        this.deuterium = deuterium;
        this.hParticle = hParticle;
        this.update = function () {
            this.metall += 2;
            this.kristall += 1;
            this.deuterium += 0.5;
        };
    }
    

io.use(sharedsession(session, {
    autoSave:true
}));
    var userConnections = [];

 io.sockets.on('connection', function(socket){

     var username = socket.handshake.session.id;

     var existingUser = userConnections.find(function(userConnection){
         return userConnection.username === username;
     });

     if (!existingUser){
         existingUser = {
             username: username,
             sockets: []
         }
         userConnections.push(existingUser);
     }

     existingUser.sockets.push(socket);

     //connections.push(socket)
     console.log('User connected: Online %s', userConnections.length);

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
       if (existingUser.sockets.length === 0){
            if(socket.handshake.session.userdata){
                if(firstLogin === 0){
                    firstLogin++;
                }else{
                    if(userConnections){
                        userConnections.splice(userConnections.indexOf(existingUser.username), 1);
                        delete socket.handshake.session.userdata;
                        socket.handshake.session.save();
                        test = null;
                        console.log('User disconnected: Online %s', userConnections.length);
                    }
                  
                }
            }else{
                if(userConnections){
                    userConnections.splice(userConnections.indexOf(existingUser.username), 1);
                    console.log('User disconnected: Online %s', userConnections.length);
                }
            }
        }
   });

    socket.on('evalServer',function(data){
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer',res);     
    });
   
});

//Variable is to check if user connected in session first time with his account
//finde better way to save it maby it overwrites other peoples firstLogin maby with session.firstLogin
var firstLogin = 0;

setInterval(function(){
        //  var z = 0;
        //  var socket = SOCKET_LIST[i];
        //  socket.emit('updateRessourcen',z.toFixed(2))
        //   socket.emit('updateRessourcen',pack);
    if(userConnections.length != 0){
        console.log(userConnections);
    }
    if(test != null) {
        test.update();
        console.log(test.metall + "/////" + test.kristall + "////"  + test.deuterium + "/////" + test.hParticle);
    }
},1000/1);

};



