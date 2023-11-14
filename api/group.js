require('dotenv').config()
const emailExistence = require('email-existence');
var Users = require("../db/User");
var Groups = require("../db/Group");

function findByEmail(email, callback) {
    Users.findOne({email: email}, callback);
}



function createUser(data, callback) {
    // var salt = bcrypt.genSaltSync(15);
    // var pass = bcrypt.hashSync(data.password, salt);
    var user = {
        email: data.email,
        username: data.username,
        password: data.password,
        group: null
    };
    Users.create(user, callback);  
}

function createGroup(data, callback) {
    // var salt = bcrypt.genSaltSync(15);
    // var pass = bcrypt.hashSync(data.password, salt);
    var group = {
        groupID: data.groupID,
        groupName: data.groupName,
        groupHost: data.groupHost,
        dollarLimit: data.dollarLimit
    };
    Groups.create(group, callback);  
}


module.exports = function(app) {
    app.get('/api/groupInfo', (req, res) => {
        Groups.findOne({groupID: req.query.groupId}, (err, data) => {
            if (err || !data) {
                return res.status(400).json({
                    status: 'error',
                    error: err,
                    message: 'Couldn\'t create a group'
                })
            } else {
                return res.status(200).json({status: 'success', data: data});
            }
        })
    });
};