/**
 * Created by thasneem on 25/3/16.
 */
var mongos = require("mongoose");

var UserDetail = new mongos.Schema({
    name: String,
    username: String,
    password: String,
    image_url: String,
    chat: []
});
module.exports = mongos.model('UserDetail', UserDetail);