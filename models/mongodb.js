var mongodb = require('./db');

function Meeting(meeting) {
  this.meetingName = meeting.meetingName;
  //this.password = meeting.password;
  //this.email = meeting.email;
  this.members = meeting.members;
};

module.exports = Meeting;

//存储会议信息
Meeting.prototype.save = function(callback) {
  //要存入数据库的用户文档
  var meeting = {
      meetingName: this.meetingName,
      members: this.members
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 meeting 集合
    db.collection('meetings', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将用户数据插入 meeting 集合
      collection.insert(meeting, {
        safe: true
      }, function (err, meeting) {
        mongodb.close();
        if (err) {
          return callback(err);//错误，返回 err 信息
        }
        callback(null, meeting[0]);//成功！err 为 null，并返回存储后的会议文档
      });
    });
  });
};
