/*var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT), {safe: true});*/
/**
 * init the mongoose
 */
var settings = require('../settings'),
mongoose = require('mongoose').connect('mongodb://'+settings.host+"/"+settings.db,{"user":settings.user,"pass":settings.pass});
module.exports = mongoose;
