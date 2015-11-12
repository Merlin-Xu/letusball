var mongoose = require('./db'),
    _ = require("underscore"),
    Schema = mongoose.Schema;
// mongoose.connect('mongodb://localhost/crm');
var teamSchema = new Schema({
    id: Schema.Types.ObjectId,
    teamName: String,
    teamId: String,
    city: String,
    teamBrief: Schema.Types.Mixed,
    updatedTime: {
        type: Date,
        default: Date.now
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    captain: String,
    captainId: String,
    teamStatus: String,
    inputName: String,
    createdId: String,
    updatedId: String,
    point: Schema.Types.Mixed
});

var teamModel = mongoose.model('teams', teamSchema);

function Team(team) {
    this.teamName = team.teamName;
    this.teamId = team.teamId;
    this.city = team.city;
    this.teamBrief = team.teamBrief;
    this.updatedTime = team.updatedTime;
    this.createdTime = team.createdTime;
    this.captain = team.captain;
    this.captainId = team.captainId;
    this.teamStatus = team.teamStatus;
    this.inputName = team.inputName;
    this.createdId = team.createdId;
    this.updatedId = team.updatedId;
    this.point = team.point;
}

//存储会议信息
Team.prototype.save = function(callback) {
    //要存入数据库的用户文档
    var team = {
        teamName: this.teamName,
        teamId: this.teamId,
        city: this.city,
        teamBrief: this.teamBrief,
        updatedTime: new Date(),
        createdTime: new Date(),
        captain: this.captain,
        captainId: this.captainId,
        teamStatus: this.teamStatus,
        inputName: this.inputName,
        createdId: this.createdId,
        updatedId: this.updatedId,
        point: this.point
    };
    var conditions = {
        teamId: team.teamId
    };
    teamModel.findOne(conditions, function(err, doc) {
        if (doc === null) {
            var newTeam = new teamModel(team);
            newTeam.save(function() {
                callback(err, newTeam);
            });
        } else {
            doc.teamName = team.teamName;
            doc.teamId = team.teamId;
            doc.city = team.city;
            doc.teamBrief = team.teamBrief;
            doc.updatedTime = team.updatedTime;
            doc.createdTime = team.createdTime;
            doc.captain = team.captain;
            doc.captainId = team.captainId;
            doc.teamStatus = team.teamStatus;
            doc.inputName = team.inputName;
            doc.createdId = team.createdId;
            doc.updatedId = team.updatedId;
            doc.point = _.defaults(team.point, doc.point);

            doc.save(function() {
                callback(err, doc);
            });
        }
    });
};
//

Team.prototype.findTeams = function(conditions, callback) {
    // executing a query explicitly
    var query1 = teamModel.find(conditions, "teamName teamId city teamBrief captain");
    var query2 = teamModel.find(conditions);
    query1.exec(function(err, docs) {
        query2.count(function(errs, count) {
            callback(err, docs, count);
        });
    });

};
module.exports = Team;