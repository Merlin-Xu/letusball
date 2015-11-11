//var Meeting = require("../models/meeting.js");
var Team = require("../models/Team.js"),
    express = require("express"),
    // async = require('async'),
    // nodeExcel = require('excel-export'),
    _ = require("underscore"),
    // request = require('request'),
    // strftime = require('strftime'),
    router = express.Router();
    // Room = require("../models/room.js");
    router.route('/saveTeam').get(function(req, res, next) {

            console.log("Done");
            var TeamEntry = {
                teamName: req.query.teamName,
                teamId: '21',
                city: req.query.city,
                teamBrief: req.query.teamBrief,
                updatedTime: new Date(),
                createdTime: new Date(),
                captain: 'King',
                captainId: '1',
                teamStatus: 0,
                inputName: 'Fie',
                createdId: '123',
                updateedId: '123',
                point: {"W":0,"D":0,"L":0}
            };
            team = new Team(TeamEntry);
            team.save(function(err, doc) {
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
 router.get('/searchIndex', function(req, res) {
        res.render('searchIndex', {
            title: 'Attendees Report',
            success: 'success',
            error: 'error'
        });
    });

router.get('/getTeamDetail', function(req, res, next) {
    var conditions = {};
    /*    startTime = '',
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
        };*/
    var teamSummary = {};
    team = new Team(teamSummary);
    team.findTeams(conditions, function(err, meetings, total) {
        if (err) {
            meetings = [];
        }
        meetings.total = total;
        res.header('Content-type', 'application/json');
        res.header('Charset', 'utf8');
        res.jsonp(meetings);
    });
});
/*
    app.use('/', teamControls);

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
            meetings[0].startTime = strftime('%B %d, %Y %H:%M:%S', new Date(meetings[0].startTime));
            res.render('listDetails', {
                title: 'Attendees Report Detail Info',
                meeting: meetings[0],
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
    });*/

module.exports = router;