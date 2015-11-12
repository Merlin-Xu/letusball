/*
  Module dependencies:

  - Express
  - Http (to run Express)
  - Underscore (because it's cool)
  - Socket.IO

  It is a common practice to name the variables after the module name.
  Ex: http is the "http" module, express is the "express" module, etc.
  The only exception is Underscore, where we use, conveniently, an
  underscore. Oh, and "socket.io" is simply called io. Seriously, the
  rest should be named after its module name.

*/

var express = require("express"),
  connect = require('connect'),
  teams = require('./routes/teamControl'),
  app = express(),
  favicon = require('serve-favicon'),
  path = require('path'),
  http = require("http").createServer(app),
  /*io = require("socket.io").listen(http, {
    'log level': 0
  }), */// 0 - error, 1 - warn, 2 - info, 3 - debug
  _ = require("underscore"),
  // later = require("later"),
  // request = require('request'),
  settings = require('./settings'),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  mongoose = require('./models/db'),
  logger = require('morgan'),
  flash = require('connect-flash'),
  session = require('express-session'),
  async = require('async'),
  MongoStore = require('connect-mongo')(session),
  // qs = require('querystring'),
  accessLog = fs.createWriteStream(__dirname + '/access.log', {
    flags: 'a'
  }),
  errorLog = fs.createWriteStream(__dirname + '/error.log', {
    flags: 'a'
  });
  syncLog = fs.createWriteStream(__dirname + '/syncLog.log', {
    flags: 'a'
  }),
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
/*print the log in terminal*/
app.use(logger('dev'));
/*use logger to store the log in file test*/
app.use(logger({
  stream: accessLog
}));
// io.set('transports', ['xhr-polling']);
app.use(favicon(__dirname + '/favicon.ico'));
app.use(methodOverride());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer);
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db, //cookie name
  resave: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }, //30 days
  store:new MongoStore({mongooseConnection:mongoose.connection})
}));
// app.use(session({}));
//set the params for the request

// later.date.localTime();

// console.log("Now:" + new Date());
//Server's IP address
app.set("ipaddr", "127.0.0.1");

//Server's port number
app.set("port", 8070);
/* Socket.IO events */

app.use(function(req, res) {
  res.render("404");
});
app.use(function(err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

//Start the http server at port and IP defined before
http.listen(app.get("port"), function() {
  console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});
app.use('/team', teams);
