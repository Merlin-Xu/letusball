var mongoose = require('./db'),
_ = require("underscore"),
Schema = mongoose.Schema;
// mongoose.connect('mongodb://localhost/crm');
var meetingSchema = new Schema({
  id:Schema.Types.ObjectId,
  meetingRoomName: String,
  meetingId:String,
  meetingSubject:String,
  members: Schema.Types.Mixed,
  updated: { type: Date, default: Date.now },
  startTime:{ type: Date, default: Date.now },
  ownerCorpId:String,
  ownerName:String
});

var meetingModel = mongoose.model('meetings', meetingSchema);

function Meeting(meeting) {
  this.meetingRoomName = meeting.meetingRoomName;
  this.meetingId = meeting.meetingId;
  this.members = meeting.members;
  this.meetingSubject = meeting.meetingSubject;
  this.startTime = meeting.startTime;
  this.ownerCorpId = meeting.ownerCorpId;
  this.ownerName = meeting.ownerName;
};

//存储会议信息
Meeting.prototype.save = function(callback) {
  //要存入数据库的用户文档
  var meeting = {
      meetingRoomName: this.meetingRoomName,
      meetingId : this.meetingId,
      members: this.members,
      meetingSubject:(this.meetingSubject!= null)?this.meetingSubject:"No summary",
      startTime: this.startTime,
      ownerCorpId : this.owneCorpId,
      ownerName : this.ownerName
  };
  var conditions = {meetingId:meeting.meetingId};
  var membersAdd = meeting.members;
  meetingModel.findOne(conditions, function (err, doc) {
  if(doc == null){
    var newMeeting = new meetingModel(meeting);
    newMeeting.save(function(){
      callback(err, newMeeting);
    });
  }else{
    doc.meetingRoomName = meeting.meetingRoomName;
    doc.meetingId = meeting.meetingId;
    doc.startTime = meeting.startTime;
    doc.meetingSubject = meeting.meetingSubject;
    doc.ownerCorpId = meeting.ownerCorpId;
    doc.ownerName = meeting.ownerName;
    doc.members=_.defaults(meeting.members, doc.members);
    doc.save(function(){
      callback(err, doc);
    });
  }
});
};
//

Meeting.prototype.findMeetings = function(conditions, callback){
  // executing a query explicitly
  var query1 = meetingModel.find(conditions,"meetingSubject meetingRoomName meetingId startTime members");
  var query2 = meetingModel.find(conditions);
  query1.exec(function (err, docs) {
    query2.count(function (errs, count) {
      callback(err, docs,count);
    });
});

};
module.exports = Meeting;