require('dotenv').config()
const emailExistence = require('email-existence');
var Users = require("../db/User");
var Groups = require("../db/Group");
const Group = require('../db/Group');
var CryptoJS = require("crypto-js");



function encrypt(data) {
    var bytes  = CryptoJS.AES.encrypt(data, process.env.SECRET);
    return bytes.toString();
}

function decrypt(data) {
    var bytes  = CryptoJS.AES.decrypt(data, process.env.SECRET);
    console.log(bytes.toString(CryptoJS.enc.Utf8), '------------------------------sdd')
    return bytes.toString(CryptoJS.enc.Utf8);
}
// Encrypt

// const withAuth = require('./middleware');
// const bcrypt = require('bcryptjs');
// const Cryptr = require('cryptr');
// const cryptr = new Cryptr(process.env.SECRET);
// const jwt = require('jsonwebtoken');


// function encode(email) {
//     if (!email) return "";
//     return cryptr.encrypt(email);
// }

// function decode(email) {
//     if (!email) return "";
//     return cryptr.decrypt(email);
// }

// function createSession(email, req, res, data) {
//     var emailhash = encode(email);
    
//     const token = jwt.sign({emailhash}, process.env.SECRET, {
//         expiresIn: 60*60*100
//     });
//     return res.cookie('token', token, { httpOnly: true }).status(200).json(data);
// }


// function killSession(req, res) {
//     // kill session
    
//     // const token = jwt.sign('invalid', process.env.SECRET, {
//     //     expiresIn: 0*60*60*100
//     // });
//     return res.clearCookie("token").sendStatus(200);
// }

// function login(err, data, password, req, res) {
//     if (!err && data) {
//         var user = {
//             playerTag: data.playerTag ,
//             isAdmin: data.admin
//         };
//         if (verifyPass(data, password)) return createSession(data.email, req, res, user);
//         else res.status(401).json({ error: 0, msg: "Incorrect Password" });
//     } 
//     else return res.status(401).json({ error: 1, msg: "Email does not exists" });
// }p


// function verifyPass(data, password) {
//     if (!data || !password) return false;
//     return bcrypt.compareSync(password, data.password);;
// }

function findByEmail(email, callback) {
    Users.findOne({email: email}, callback);
}

// function getAll(callback) {
//     Users.find({}, callback);
// }

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

    // Authentication
    app.post('/api/signup', (req, res) => {
        console.log('jana req', req)
        var formData = req.body;

        findByEmail(formData.email, (err, data) => {
            if (err || !data) {
                // email doesn't exist we are good
                // emailExistence.check(formData.email, function(error, response){
                    // console.log('jana email check response', response);
                    // if (response == true) {
                createUser(formData, (err, data) => {
                    if (err) {
                        return res.status(400).json({status: 'error', error: err, msg:"Failed to create user."});
                    // todo
                    } else {
                        return res.status(200).json({status: 'success', data: data});
                    } 
                });
                    // } else {
                    //     return res.status(401).json({status: 'error', error: error, msg: "Email doesn't exists" });
                    // }
                // });
            } else {
                return res.status(401).json({ status: 'error', error: 0, msg: "Email exists" });
            }
        });
    });

    app.put('/api/createGroup', (req, res) => {
        console.log('jana data', req.body)
        const filter = { username: req.body.username };
        const update = { group: req.body.group, isHost: true };
        
        createGroup({
            groupID: req.body.group,
            groupName: req.body.groupName,
            groupHost: req.body.username,
            dollarLimit: req.body.dollarLimit
        }, (err, data) => {
            if (err) {
                console.log('data', data)
                return res.status(400).json({status: 'error', error: err, msg:"Failed to create group."});
            // todo
            } else {
                Users.findOneAndUpdate(filter, update, {
                    new: true
                }, (err, data) => {
                    if (err || !data) {
                        return res.status(400).json({
                            status: 'error',
                            error: err,
                            message: 'Couldn\'t create a group'
                        })
                    } else {
                        return res.status(200).json({status: 'success', data: {
                            email: data.email,
                            username: data.username,
                            password: data.password,
                            group: data.group,
                            isHost: data.isHost,
                            groupName: req.body.groupName,
                            groupHost: req.body.username,
                            dollarLimit: req.body.dollarLimit
                        }});
                    }
                });
            } 
        });
    });

    app.put('/api/joinGroup', async (req, res) => {
        console.log('jana req', req)
        var groupInfo = await Groups.findOne({groupID: req.body.group});
        if (groupInfo != null) {
            const filter = { group: req.body.group };
            const update = { group: req.body.group, isHost: false };
            Users.findOne(filter, (err, data) => {
                if (err || !data) {
                    return res.status(400).json({
                        status: 'error',
                        error: err,
                        message: 'Couldn\'t find that group'
                    })
                } else {
                    Users.findOneAndUpdate(
                    {
                        username: req.body.username
                    },
                    update,
                    {
                        new: true
                    },
                    (err, data) => {
                        if (err || !data) {
                            return res.status(400).json({
                                status: 'error',
                                error: err,
                                message: 'Couldn\'t update your profile'
                            })
                        } else {
                            console.log('jana group info', groupInfo)
                            return res.status(200).json({status: 'success', data: {
                                email: data.email,
                                username: data.username,
                                password: data.password,
                                group: data.group,
                                isHost: data.isHost,
                                groupName: groupInfo != null ? groupInfo.groupName : '',
                                groupHost: groupInfo != null ? groupInfo.groupHost : '',
                                dollarLimit: groupInfo != null ? groupInfo.dollarLimit: 0
                            }});
                        }
                    })
                }
            });
        } else {
            return res.status(400).json({
                status: 'error',
                error: err,
                message: 'Couldn\'t find that group'
            })
        }

    });
    // app.post('/api/signout', (req, res) => {
    //     return killSession(req, res);
    // });

    app.get('/api/login', (req, res) => {
        console.log('janasdsd')
        const [username, password] = [req.query.username, req.query.password];
        console.log('jana on api', username, password)
       
        Users.findOne({username: username}, async (err, data) => {
            if (err) {
                return res.status(401).json({
                    status: 'error', error: err, message: "Cannot login"
                })
            } else {
                if (data != null && decrypt(data.password) == password) {
                    var groupInfo = await Groups.findOne({groupID: data.group});
                    return res.status(200).json({
                        status: 'success', data: {
                            email: data.email,
                            username: data.username,
                            password: data.password,
                            group: data.group,
                            isHost: data.isHost,
                            groupName: groupInfo != null ? groupInfo.groupName : '',
                            groupHost: groupInfo != null ? groupInfo.groupHost : '',
                            dollarLimit: groupInfo != null ? groupInfo.dollarLimit: 0
                        }
                    }) 
                } else {
                    return res.status(401).json({
                        status: 'error', error: err, message: "Cannot login, invalid credentials"
                    }) 
                }
            }
        });
    });

    app.get('/api/getMembers', (req, res) => {
        const group = req.query.group;
        Users.find({group: group}, (err, data) => {
            if (err) {
                return res.status(401).json({
                    status: 'error', error: err, message: "Cannot get members"
                })
            } else {
                return res.status(200).json({
                    status: 'success', data: data
                }) 

            }
        });
    });
};