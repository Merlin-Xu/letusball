//var Meeting = require("../models/meeting.js");
var Meeting = require("../models/meeting.js"),
  express = require("express"),
  async = require('async'),
  nodeExcel = require('excel-export'),
  _ = require("underscore"),
  request = require('request'),
  strftime = require('strftime'),
  Room = require("../models/room.js");
module.exports = function(app) {
  /* Server routing */
  //Handle route "GET /", as in "http://localhost:8080/"
  var meetingControls = express.Router();

  meetingControls.post('/saveParticipants', function(request, response, next) {
    var test = {
      'meetingName': request.query.meetingId,
      'members': request.query.corpIdArr
    };
    meeting = new Meeting(test);
    meeting.save(function(err) {
      if (err) {
        console.log("Error!");
      }
      console.log("Success!");

    });
    response.header('Content-type', 'application/json');
    response.header('Charset', 'utf8');
    response.jsonp(test);
  });
  meetingControls.get('/saveParticipants', function(req, res, next) {
    var membersBefore = [];
    var arr = req.query.corpIdArr.split(",");
    async.waterfall([

      function(callback) {
        _.each(arr, function(element, index) {
          var option = {
            url: '',
            headers: {
              'User-Agent': 'request',
            }
          };
          var elem = "A" + element;
          callback(null, index, elem, option);
        });
      },
      function(arg1, arg2, arg3, callback) {
        request(arg3, function(error, resq, body) {
          if (!error && resq.statusCode == 200) {
            var personInfo = eval(body.split("success")[1]);
            var member = personInfo.lastName + ' ' + personInfo.fdirName;
            var memberInfo = {
              memberCorpId: arg2,
              memeberName: member
            };
            membersBefore.push(memberInfo);
          }
          if (membersBefore.length == arr.length)
            callback(null, memberInfo);
        });
      }
    ], function(err, result) {
      console.log("Done");
      var meetingSummary = {
        'meetingRoomName': req.query.meetingName,
        'members': membersBefore,
        'meetingId': req.query.meetingId,
        'meetingSubject': req.query.meetingSubject,
        'ownerCorpId': '',
        'ownerName': '',
        'startTime': req.query.startTime
      };
      meeting = new Meeting(meetingSummary);
      meeting.save(function(err, doc) {
        if (err) {
          console.log("Error!");
          res.jsonp(500, "Error");
        } else {
          res.header('Content-type', 'application/json');
          res.header('Charset', 'utf8');
          res.jsonp(doc);
        }
      });
    });

  });

  meetingControls.get('/getParticipants', function(req, res) {
    var conditions = {},
      startTime = '',
      endTime = '';
    if (req.query.meetingName != null && req.query.meetingName != "")
      conditions['meetingRoomName'] = new RegExp(req.query.meetingName);
    if (req.query.startTime != null && req.query.startTime != "")
      startTime = new Date(req.query.startTime);
    if (req.query.endTime != null && req.query.endTime != "")
      endTime = new Date(req.query.endTime + ' 23:59:59');
    if (startTime != '' && endTime != "")
      conditions.startTime = {
        $gt: startTime,
        $lt: endTime
      };
    else if (startTime != '' && endTime == "")
      conditions.startTime = {
        $gt: startTime
      };
    else if (startTime == '' && endTime != "")
      conditions.startTime = {
        $lt: endTime
      };
    var meetingSummary = {};
    meeting = new Meeting(meetingSummary);
    console.log(JSON.stringify(conditions));
    meeting.findMeetings(conditions, function(err, meetings, total) {
      if (err) {
        meetings = [];
      }
      meetings.total = total;
      res.header('Content-type', 'application/json');
      res.header('Charset', 'utf8');
      res.jsonp(meetings);
    });
  });

  app.use('/', meetingControls);

  app.get('/searchIndex', function(req, res) {
    res.render('searchIndex', {
      title: 'Attendees Report',
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.get('/listDetails', function(req, res) {
    var conditions = {};
    if (req.query.meetingId != null && req.query.meetingId != "")
      conditions.meetingId = req.query.meetingId;
    var meetingSummary = {};
    meeting = new Meeting(meetingSummary);
    console.log(JSON.stringify(conditions));
    meeting.findMeetings(conditions, function(err, meetings, total) {
      meetings[0].startTime = strftime('%B %d, %Y %H:%M:%S',new Date(meetings[0].startTime));
        res.render('listDetails', {
          title: 'Attendees Report Detail Info',
          meeting:meetings[0],
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
        });
  });
});
app.get('/getRoomsBySite', function(req, res) {
  var conditions = {};
  console.log("Enter");
  if (req.query.siteCode != null && req.query.siteCode != "")
    conditions.siteCode = req.query.siteCode;
  var roomEntry = {};
  room = new Room(roomEntry);
  console.log(JSON.stringify(conditions));
  room.findrooms(conditions, function(err, rooms, total) {
    if (err) {
      rooms = [];
    }
    rooms.total = total;
    res.header('Content-type', 'application/json');
    res.header('Charset', 'utf8');
    res.jsonp(rooms);
  });
});
app.get('/Excel', function(req, res) {
  var conditions = {};
  if (req.query.meetingId != null && req.query.meetingId != "")
    conditions.meetingId = req.query.meetingId;
  var meetingSummary = {};
  meeting = new Meeting(meetingSummary);
  meeting.findMeetings(conditions, function(err, meetings, total) {
    var conf = {};
    conf.stylesXmlFile = "styles.xml";
    conf.cols = [{
      caption: '#',
      type: 'number',
      width: 18.7109375
    }, {
      caption: 'Corp ID',
      type: 'string',
      width: 50
    }, {
      caption: 'Name',
      type: 'string',
      width: 50
    }];
    conf.rows = new Array();
    if (meetings.length > 0) {
      var memebersArr = [];
      _.each(meetings[0].members, function(element, index) {
        memebersArr.push([++index, element.memberCorpId, element.memeberName]);
      });
      conf.rows = memebersArr;
    }
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report" + meetings[0].meetingRoomName+ strftime('%F %R', new Date(meetings[0].startTime))+ ".xlsx");
    res.end(result, 'binary');
    //res.download(result);
  });
});
app.get('/ExcelCurrentTable', function(req, res) {
  var conditions = {},
    startTime = '',
    endTime = '';
  if (req.query.meetingName != null && req.query.meetingName != "")
    conditions['meetingRoomName'] = new RegExp(req.query.meetingName);
  if (req.query.startTime != null && req.query.startTime != "")
    startTime = new Date(req.query.startTime);
  if (req.query.endTime != null && req.query.endTime != "")
    endTime = new Date(req.query.endTime + ' 23:59:59');
  if (startTime != '' && endTime != "")
    conditions.startTime = {
      $gt: startTime,
      $lt: endTime
    };
  else if (startTime != '' && endTime == "")
    conditions.startTime = {
      $gt: startTime
    };
  else if (startTime == '' && endTime != "")
    conditions.startTime = {
      $lt: endTime
    };
  var meetingSummary = {};
  meeting = new Meeting(meetingSummary);
  console.log(JSON.stringify(conditions));
  meeting.findMeetings(conditions, function(err, meetings, total) {
    var conf = {};
    conf.stylesXmlFile = "styles.xml";
    conf.cols = [{
      caption: '#',
      type: 'number',
      width: 18.7109375
    }, {
      caption: 'Meeting Room',
      type: 'string',
      width: 20
    }, {
      caption: 'Date',
      type: 'string',
      width: 50
    }, {
      caption: 'Meeting Subject',
      type: 'string',
      width: 100
    }, {
      caption: 'Counts',
      type: 'number',
      width: 20
    }];
    conf.rows = new Array();
    if (_.isArray(meetings)) {
      var memebersArr = [];
      _.each(meetings, function(element, index) {
        memebersArr.push([++index, element.meetingRoomName, strftime('%B %d, %Y %H:%M:%S', new Date(element.startTime)), (element.meetingSubject == undefined) ? "No subject" : element.meetingSubject, element.members.length]);
      });
      conf.rows = memebersArr;
    }
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "ReportBySearch.xlsx");
    res.end(result, 'binary');
  });
});
};