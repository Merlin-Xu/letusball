var mongoose = require('./db'),
_ = require("underscore"),
Schema = mongoose.Schema;
// mongoose.connect('mongodb://localhost/crm');
var meetingOriginSchema = new Schema({
  id:Schema.Types.ObjectId,
  updated: { type: Date, default: Date.now },
  responseMsg: String,
  freebusyIntervalAvailability:Array,
  detailedFreebusydata:Schema.Types.Mixed,
  roomMetaData:Schema.Types.Mixed,
  roomAlias:String
});

var meetingOriginModel = mongoose.model('meetingOrigin', meetingOriginSchema);

function MeetingOrigin(meetingOrigin) {
  this.responseMsg = meetingOrigin.responseMsg;
  this.freebusyIntervalAvailability = meetingOrigin.freebusyIntervalAvailability;
  this.detailedFreebusydata = meetingOrigin.detailedFreebusydata;
  this.roomMetaData = meetingOrigin.roomMetaData;
  this.roomAlias = meetingOrigin.roomAlias
};

//存储会议信息
MeetingOrigin.prototype.save = function() {
  //要存入数据库的用户文档
  var meetingOrigin = {
      responseMsg:this.responseMsg,
      freebusyIntervalAvailability:this.freebusyIntervalAvailability,
      detailedFreebusydata:this.detailedFreebusydata,
      roomMetaData:this.roomMetaData,
      roomAlias:this.roomAlias
  };
  var conditions = {roomAlias:meetingOrigin.roomAlias};
  meetingOriginModel.findOne(conditions, function (err, doc) {
  if(doc == null){
    var newMeeting = new meetingOriginModel(meetingOrigin);
    newMeeting.save(function(){
      console.log("sAVE PROTOYTPE HAVE BEEN IN.");
    });
  }else{
    doc.responseMsg = meetingOrigin.responseMsg;
    doc.freebusyIntervalAvailability = meetingOrigin.freebusyIntervalAvailability;
    doc.detailedFreebusydata = meetingOrigin.detailedFreebusydata;
    doc.roomMetaData = meetingOrigin.roomMetaData;
    doc.roomAlias = meetingOrigin.roomAlias
    doc.save(function(){
      console.log("sAVE PROTOYTPE HAVE BEEN IN.");
    });
  }
});
};
//

MeetingOrigin.prototype.findMeetings = function(conditions, callback){
  // executing a query explicitly
  console.log("Enter meta find function.");
  meetingOriginModel.findOne(conditions, function (err, doc) {
    console.log("Find Meetings PROTOYTPE HAVE BEEN IN.");
    if (doc != null) {
      callback(err,doc);
    }
  });
};
module.exports = MeetingOrigin;