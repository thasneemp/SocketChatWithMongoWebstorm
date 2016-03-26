var express = require('express');
var router = express.Router();

var UserD = require('../models/user_data');

var message_exist = "User already exist";
var message_login_success = "User login Success";
var message_login_failed = "User login Failed";
var message_success_insert = "User registration success";
var message_success_list = "User list";
var message_failed_insert = "User registration Failed";
var message_error = "Error occurred";

var message = {
    server_status: {
        message: "",
        status: true
    },
    userDetails: null
}


/**
 *  Inserting new User
 */
router.post('/register', function (req, res, next) {
    var usedt = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        image_url: req.body.image_url == undefined ? "" : req.body.image_url
    }
    console.log(usedt);
    UserD.find({username: usedt.username}, {_id: 1, username: 1}, function (err, userdeatils) {
        if (err) {
            message.server_status.message = message_failed_insert;
            message.server_status.status = false;
            res.send(message);
        } else if (userdeatils == undefined || userdeatils == null || userdeatils.length == 0) {
            insertData(usedt, res);
        } else {
            message.server_status.message = message_exist;
            message.server_status.status = false;
            message.userDetails = userdeatils;
            res.send(message);
        }
    });


});

/**
 * Inserting data
 * @param usedt from mongo
 * @param res from server
 */
function insertData(usedt, res) {
    var userd = new UserD();
    userd.name = usedt.name;
    userd.username = usedt.username;
    userd.password = usedt.password;
    userd.image_url = usedt.image_url;

    userd.save(function (err, userdetails) {
        if (err) {
            message.server_status.message = message_failed_insert;
            message.server_status.status = false;
            res.send(message);
        } else {
            message.server_status.message = message_success_insert;
            message.server_status.status = true;
            message.userDetails = userdetails;
            res.send(message);
        }

    });
}

router.get('/getcontacts', function (req, res, next) {

    var id = req.param("id");
    UserD.find({_id: {$nin: [id]}}, {chat: 0, password: 0, __v: 0}, function (err, details) {
        if (err) {
            res.send("error");
        } else {
            message.server_status.message = message_success_list;
            message.server_status.status = true;
            message.userDetails = details;
            res.send(message);
        }
    });
});

/**
 * User Login
 */
router.post('/login', function (req, res, next) {
    UserD.findOne({$and: [{username: req.body.username}, {password: req.body.password}]}, {
        chat: 0,
        password: 0,
        __v: 0
    }, function (err, userdetails) {
        if (err) {
            res.send(message_error);
        } else if (userdetails == null || userdetails.length == 0) {
            message.server_status.message = message_login_failed;
            message.server_status.status = false;
            message.userDetails = userdetails;
            res.send(message)
        } else {
            message.server_status.message = message_login_success;
            message.server_status.status = true;
            message.userDetails = userdetails;
            res.send(message)
        }
    });
});

module.exports = router;
