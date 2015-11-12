//test save and update
$.ajax({
        url: "http://localhost:8080/saveParticipants",
		data: {meetingId:'2009',meetingSubject:'test summary nihao',meetingName:'Taishan',corpIdArr:'530831,528946,520831,526570',startTime:new Date()},
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        jsonpCallback:"success",
        error: function () {
           console.log("Unable to Get FreeBusy Data");
        },
        success: function (response) {
			console.log("What's Great");
    }
});
//test find
$.ajax({
        url: "http://localhost:8080/getParticipants",
		//data: {meetingId:'2008',meetingName:'Taishan',corpIdArr:'526525'},
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        jsonpCallback:"success",
        error: function () {
           console.log("Unable to Get FreeBusy Data");
        },
        success: function (response) {
			console.log("What's Great");
    }
});
$.ajax({
        url: "http://localhost:8080/getRoomsBySite",
        data: {'siteCode':'DBL'},
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        jsonpCallback:"success",
        error: function () {
           console.log("Unable to Get FreeBusy Data");
        },
        success: function (response) {
            console.log("What's Great"+'\n'+JSON.stringify(response));

    }
});

$.ajax({
        url: "http://localhost:8070/teams/saveTeam",
    data: {teamName:'2009',city:'dalian',teamBrief:'Taishan'},
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        jsonpCallback:"success",
        error: function () {
           console.log("Unable to Get FreeBusy Data");
        },
        success: function (response) {
      console.log("What's Great");
    }
});

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
  routes = require('./routes'),
  app = express(),
  favicon = require('serve-favicon'),
  path = require('path'),
  http = require("http").createServer(app),
  io = require("socket.io").listen(http, {
    'log level': 0
  }), // 0 - error, 1 - warn, 2 - info, 3 - debug
  _ = require("underscore"),
  later = require("later"),
  request = require('request'),
  settings = require('./settings'),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  logger = require('morgan'),
  flash = require('connect-flash'),
  session = require('express-session'),
  async = require('async'),
  MongoStore = require('connect-mongo')(session),
  qs = require('querystring'),
  accessLog = fs.createWriteStream(__dirname + '/access.log', {
    flags: 'a'
  }),
  errorLog = fs.createWriteStream(__dirname + '/error.log', {
    flags: 'a'
  });
  syncLog = fs.createWriteStream(__dirname + '/syncLog.log', {
    flags: 'a'
  }),
  Room = require("./models/room.js");
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
io.set('transports', ['xhr-polling']);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(methodOverride());
app.use(cookieParser());
app.use(bodyParser());
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db, //cookie name
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }, //30 days
  store: new MongoStore({
    db: settings.db,
    host :settings.host
  })
}));
/*
  The list of participants in our chatroom.
  The format of each participant will be:
  {
    id: "sessionId",
    name: "participantName"
  }
*/
var participants = [],
  dataString = '',
  today = '',
  url = '',
  params = {},
  meetingArr = [];

//set the params for the request
function setCurrentDateStamp(alias) {
  console.log('alias  ---- >'+alias);
  url = '',
  today = new Date(), dd = today.getDate(), mm = today.getMonth(), yyyy = today.getFullYear(), params = {
    'jsoncallback': 'success',
    'alias': alias,
    'startTimeStamp': createEpochTimeStamp(yyyy, mm, dd, '06', '00'),
    'emailHost': '',
    'endTimeStamp': createEpochTimeStamp(yyyy, mm, dd, '23', '59')
  };
  if (dd < 10)
    dd = '0' + dd;
  if (mm < 10)
    mm = '0' + mm;
  url += qs.stringify(params);
  return url;
}
//fomat the time Stamps
function createEpochTimeStamp(year, month, day, hours, mins) {
  var now = new Date();

  var zeropad = function(num) {
    return ((num < 10) ? '0' : '') + num;
  }
  var date = new Date(zeropad(year), zeropad(month), zeropad(day), zeropad(hours), zeropad(mins), zeropad(0));
  var epochDate = date.getTime() / 1000;
  return epochDate;
}

later.date.localTime();
var options = {
  headers: {
    'User-Agent': 'request',
  }
};
//request(options, callback);

/*The room Synchronous*/
/*var switchSync = false;
if (switchSync) {
  sysnchronousRoom();
}*/

function sysnchronousRoom() {
  var optionSettings = {
    url: '',
    headers: {
      'User-Agent': 'request',
      'Content-type': 'application/json'
    }
  };
  request(optionSettings, function (error, response, body) {
    console.log("Error:" + error);
    if (!error && response.statusCode == 200) {
      var siteArr = eval(body.split("success")[1]).listEntries;
      var roomArr = [];
      var counter = 0;
      async.waterfall([

        function(callback) {
          _.each(siteArr, function(element, index) {
            var option = {
              url: '' + element,
              headers: {
                'User-Agent': 'request',
              }
            };
            request(option, function(error, resq, body) {
              console.log("err" + error);
              if (!error && resq.statusCode == 200) {
                var buildingsArr = [];
                buildingsArr = _.union(eval(body.split("success")[1]).listEntries,buildingsArr);
                callback(null, element, buildingsArr);
              }
            });
          });
        },
        function(arg1, arg2, callback) {
          _.each(arg2, function(element, index) {
            var option = {
              url: '',
              headers: {
                'User-Agent': 'request',
              }
            };
            request(option, function(error, resq, body) {
              if (!error && resq.statusCode == 200) {
                var dataPar = eval(body.split("success")[1]);
                if ( dataPar != undefined && dataPar !=null) {
                  var rooms = dataPar.rooms;
                  // if(rooms.length ==undefined){
                  //   syncLog.write("This room is null .site:"+arg1+"-->"+"building:"+element+ '\n'+JSON.stringify(rooms)+'\n');
                  // }
                  callback(null, rooms);
                } else {
                  syncLog.write("site:"+arg1+"-->"+"building:"+element+ '\n');
                }
              }
            });
          });
        }
      ], function(err, result) {
        if (result.length!=undefined) {
        _.each(result, function(element, index) {
          syncLog.write("This alias of room is null .alias:"+element.outlookAlias+'\n');
          if (element.outlookAlias == null)
            syncLog.write("Object:"+JSON.stringify(element)+'\n');

          var roomEntry = {
            'bldgCode': ((element.bldgCode != null) ? element.bldgCode : "Default"),
            'roomCode': ((element.roomCode != null) ? element.roomCode : "Default"),
            'roomName': ((element.roomName != null) ? element.roomName : "Default"),
            'siteCode': ((element.siteCode != null) ? element.siteCode : "Default"),
            'siteName': ((element.siteName != null) ? element.siteName : "Default"),
            'countryCode': ((element.countryCode != null) ? element.countryCode : "Default"),
            'gesRegion': ((element.gesRegion != null) ? element.gesRegion : "Default"),
            'bldgName': ((element.bldgName != null) ? element.bldgName : "Default"),
            'floorCode': ((element.floorCode != null) ? element.floorCode : "Default"),
            'display': ((element.display != null) ? element.display : "Default"),
            'classType': ((element.classType != null) ? element.classType : "Default"),
            'classDescription': ((element.classDescription != null) ? element.classDescription : "Default"),
            'buCode': ((element.buCode != null) ? element.buCode : "Default"),
            'roomArea': ((element.roomArea != null) ? element.roomArea : "Default"),
            'buName': ((element.buName != null) ? element.buName : "Default"),
            'spaceType': ((element.spaceType != null) ? element.spaceType : "Default"),
            'capacity': ((element.capacity != null) ? element.capacity : "Default"),
            'outlookAlias':((element.outlookAlias != null) ? element.outlookAlias : "Default"),
            'outlookDisplay': ((element.outlookDisplay != null) ? element.outlookDisplay : "Default"),
            'bookingType': ((element.bookingType != null) ? element.bookingType : "Default")
          };
          room = new Room(roomEntry);
          if (room.outlookAlias!='Default') {
            room.save(function(err, docs) {
              if (err) {
                console.log("Error!");
              } else {
                console.log("Success");
              }
            });
        }
        });
      }else{
          syncLog.write("This alias of room is null .alias:"+result.outlookAlias+'\n');
          if (result.outlookAlias == null)
            syncLog.write("Object:"+JSON.stringify(result)+'\n');

          var roomEntry = {
            'bldgCode': ((result.bldgCode != null) ? result.bldgCode : "Default"),
            'roomCode': ((result.roomCode != null) ? result.roomCode : "Default"),
            'roomName': ((result.roomName != null) ? result.roomName : "Default"),
            'siteCode': ((result.siteCode != null) ? result.siteCode : "Default"),
            'siteName': ((result.siteName != null) ? result.siteName : "Default"),
            'countryCode': ((result.countryCode != null) ? result.countryCode : "Default"),
            'gesRegion': ((result.gesRegion != null) ? result.gesRegion : "Default"),
            'bldgName': ((result.bldgName != null) ? result.bldgName : "Default"),
            'floorCode': ((result.floorCode != null) ? result.floorCode : "Default"),
            'display': ((result.display != null) ? result.display : "Default"),
            'classType': ((result.classType != null) ? result.classType : "Default"),
            'classDescription': ((result.classDescription != null) ? result.classDescription : "Default"),
            'buCode': ((result.buCode != null) ? result.buCode : "Default"),
            'roomArea': ((result.roomArea != null) ? result.roomArea : "Default"),
            'buName': ((result.buName != null) ? result.buName : "Default"),
            'spaceType': ((result.spaceType != null) ? result.spaceType : "Default"),
            'capacity': ((result.capacity != null) ? result.capacity : "Default"),
            'outlookAlias':((result.outlookAlias != null) ? result.outlookAlias : "Default"),
            'outlookDisplay': ((result.outlookDisplay != null) ? result.outlookDisplay : "Default"),
            'bookingType': ((result.bookingType != null) ? result.bookingType : "Default")
          };
          room = new Room(roomEntry);
          room.save(function(err, docs) {
          if (err) {
            console.log("Error!");
          } else {
            console.log("Success");
          }
          });

      }
      });
    }
  });
}

console.log("Now:" + new Date());
/*
var textSched = later.parse.text('every 50 second between 7:00 am and 6:00 pm');
var timer = later.setInterval(excuteTask, textSched);

function excuteTask() {
  setCurrentDateStamp(alias);
  request(options, callback);
}*/
//Server's IP address
app.set("ipaddr", "127.0.0.1");

//Server's port number
app.set("port", 8070);
/* Socket.IO events */
io.on("connection", function(socket) {
  /*
   *When a User Login , we will record the user to the participants list
   */
/*  var dataSched = later.parse.text('every 20 seconds between 7:00 am and 6:00 pm');
    var timer = later.setInterval(excutePushData(), dataSched);
    function excutePushData() {
    }*/
  /**
   * When a new user connects to our server, we expect an event called "newUser"
    and then we'll emit an event called "newConnection" with a list of all
    participants to all connected clients
   */
  socket.on("newUser", function(data) {
    console.log("newUser:" + data.id + ":" + data.name);
    socket.name = data.name;
    var partic = _.findWhere(participants, {id: socket.id});
    if(partic){
      partic.timer.clear();
    }else{
      var textSched = later.parse.text('every 20 second between 7:00 am and 6:00 pm');
      var timer = later.setInterval(excuteTask, textSched);
      console.log(timer);
      participants.push({
        id: data.id,
        name: data.name,
        timer:timer
      });
      function excuteTask() {
        options.url = setCurrentDateStamp(socket.name);
        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
              dataObj = eval(body.split("success")[1]);
              dataObj.currentDate = new Date().getDay();
              dataObj.newMark = false;
              console.log("alias-------------->"+dataObj.roomMetaData.outlookAlias);
              socket.emit("message", {
                message: dataObj
              });
            }
          });
        }
      }
  });

  /*
    When a client disconnects from the server, the event "disconnect" is automatically
    captured by the server. It will then emit an event called "userDisconnected" to
    all participants with the id of the client that disconnected
  */
  socket.on("disconnect", function() {
    console.log("clear Timer");
    var partic = _.findWhere(participants, {id: socket.id});
    partic.timer.clear();
    participants = _.without(participants,_.findWhere(participants, {id: socket.id}));

  });

  socket.on("reconnect", function() {
    console.log("reconnect Timer");
    var partic = _.findWhere(participants, {id: socket.id});
    partic.timer.clear();
  });

  /*
    When a client reset the room from the client, the event "resetting" is automatically
    captured by the server. It will then update the settings.
  */
 socket.on("resetting", function(data) {
    console.log("resetting:" + data.id + ":" + data.name);
    var partip = _.findWhere(participants, {id: data.id});
    partip.name = data.name;
    socket.name = data.name;
    options.url = setCurrentDateStamp(data.name);
    request(options,function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var dataObj = eval(body.split("success")[1]);
        dataObj.currentDate = new Date().getDay();
        dataObj.newMark = true;
        dataString = JSON.stringify(dataObj);
        console.log("What's the dataString?-->" + dataString);
        socket.emit("message", {
          message: dataObj
        });
      }
    });
  });

});

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
routes(app);
