var mongoose = require('./db'),
  _ = require("underscore");
  Schema = mongoose.Schema;
var roomSchema = new Schema({
  id: Schema.Types.ObjectId,
  bldgCode: String,
  roomCode: String,
  siteCode: String,
  siteName: String,
  updated: {
    type: Date,
    default: Date.now
  },
  countryCode: String,
  gesRegion: String,
  bldgName: String,
  floorCode: String,
  roomName: String,
  display: String,
  classType: String,
  classDescription: String,
  roomArea: String,
  buCode: String,
  buName: String,
  spaceType: String,
  capacity: String,
  outlookAlias: String,
  outlookDisplay: String,
  bookingType: {
    type: String,
    default: "outlook"
  }
});

var roomModel = mongoose.model('rooms', roomSchema);

function Room(room) {
    this.bldgCode = room.bldgCode;
    this.roomCode = room.roomCode;
    this.roomName = room.roomName;
    this.siteCode = room.siteCode;
    this.siteName = room.siteName;
    this.countryCode = room.countryCode;
    this.gesRegion = room.gesRegion;
    this.bldgName = room.bldgName;
    this.floorCode = room.floorCode;
    this.display = room.display;
    this.classType = room.classType;
    this.classDescription = room.classDescription;
    this.buCode = room.buCode;
    this.roomArea = room.roomArea;
    this.buName = room.buName;
    this.spaceType = room.spaceType;
    this.capacity = room.capacity;
    this.outlookAlias = room.outlookAlias;
    this.outlookDisplay = room.outlookDisplay;
    this.bookingType = room.bookingType;
};

//存储会议信息
Room.prototype.save = function(callback) {
  //要存入数据库的用户文档
  var room = {
      bldgCode :this.bldgCode,
      roomCode :this.roomCode,
      roomName :this.roomName,
      siteCode :this.siteCode,
      siteName :this.siteName,
      countryCode :this.countryCode,
      gesRegion :this.gesRegion,
      bldgName :this.bldgName,
      floorCode :this.floorCode,
      display :this.display,
      classType :this.classType,
      classDescription :this.classDescription,
      buCode :this.buCode,
      roomArea :this.roomArea,
      buName :this.buName,
      spaceType :this.spaceType,
      capacity :this.capacity,
      outlookAlias :this.outlookAlias,
      outlookDisplay :this.outlookDisplay,
      bookingType :this.bookingType
  };
  var conditions = {
    roomCode: room.roomCode
  };
  roomModel.findOne(conditions, function(err, doc) {
    if (doc == null) {
      var newroom = new roomModel(room);
      if (newroom.outlookAlias!=null) {
        newroom.save(function() {
          console.log("sAVE PROTOYTPE HAVE BEEN IN.:If");
          callback();
        });
      }
    } else {
        console.log("sAVE PROTOYTPE HAVE BEEN IN.else");
        callback();
    }
  });
};
//

Room.prototype.findrooms = function(conditions, callback) {
  // executing a query explicitly
  console.log("Enter meta find function.");
  // "created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}
  var query1 = roomModel.find(conditions, "outlookAlias roomCode roomName");
  var query2 = roomModel.find(conditions);
  console.log("My name is query.show time------>" + query1);
  query1.exec(function(err, docs) {
    console.log("I'm docs,Loot at me----->" + docs);
    query2.count(function(errs, count) {
      console.log("I'm count,Loot at me----->" + JSON.stringify(count));
      callback(err, docs, count);
    });
  });

};
module.exports = Room;