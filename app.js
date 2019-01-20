var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});




// get a reference to your required module
//var server = require('./server');

// name is a member of myModule due to the export above
//var server = server.server;

var app = express();

//var server = require('https').Server(app);
//Create Socket 
//var server = require('http').Server(app);
//var io = require('socket.io')(server);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cryptRouter = require('./routes/crypt');
var reCaptchaRouter = require('./routes/reCaptcha');
var mainRouter = require('./routes/main');
var contactRouter = require('./routes/contact');
var chatRouter = require('./routes/chat');
var profileRouter = require('./routes/profile');
var logoutRouter = require('./routes/logout');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Use express-session middleware for express
app.use(session);
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', cryptRouter);
app.use('/', reCaptchaRouter);
app.use('/', contactRouter);
app.use('/', mainRouter);
app.use('/', chatRouter);
app.use('/', profileRouter);
app.use('/', logoutRouter);


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
module.exports = {app: app, session: session};