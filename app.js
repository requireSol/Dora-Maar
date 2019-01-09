var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
// get a reference to your required module
//var server = require('./server');

// name is a member of myModule due to the export above
//var server = server.server;

var app = express();

//var server = require('https').Server(app);
//Create Socket 
var server = require('http').Server(app);
var io = require('socket.io')(server);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cryptRouter = require('./routes/crypt');


users = [];
connections = [];

io.sockets.on('connection', function(socket){
   //Connect
    connections.push(socket)
    console.log('socket connection %s', connections.length);
    
    //Listen to event "disconnect"
    socket.on('disconnect',function(data){
        //Disconnect
        connections.splice(connections.indexOf(socket), 1);
        console.log('socket disconnection %s' , connections.length);
    });

    //Listen to event telegram Message "contact"
    socket.on('send message',function(data){
        //emit Msg From from
        io.sockets.emit('new message', { msg: data });
    });

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', cryptRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//IO
module.exports = {app: app, server: server};
