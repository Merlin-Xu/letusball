var settings = require('../settings'),
mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/crm');
var db = mongoose.createConnection('mongodb://'+settings.host+"/"+settings.db,{"user":settings.user,"pass":settings.pass}); //创建一个数据库连接
var meetingSchema = mongoose.Schema({
  meetingName: String,
  meetingId:String,
  members: Array,
  ownerCorpId:String,
  ownerName:String
});

var meetingModel = mongoose.model('meetings', meetingSchema);

db.on('error',console.error.bind(console,'连接错误:'));

db.once('open',function(){
      //一次打开记录
        console.log("openned");
          var personEntity = new meetingModel({meetingName:'zKrxxxouky'});
         personEntity.save();

        meetingModel.find(function(err,persons){
      //查询到的所有person
            console.log(err);
            console.log(persons);
              db.close();
    });
    });