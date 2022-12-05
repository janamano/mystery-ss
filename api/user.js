require('dotenv').config()
const emailExistence = require('email-existence');
var Users = require("../db/User");
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
// }


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
        console.log('jana req', req)
        const filter = { username: req.body.username };
        const update = { group: req.body.group, isHost: true };
        
        // `doc` is the document _before_ `update` was applied
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
                return res.status(200).json({status: 'success', data: data});
            }
        });
    });

    app.put('/api/joinGroup', (req, res) => {
        console.log('jana req', req)
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
                        return res.status(200).json({status: 'success', data: data});
                    }
                })
            }
        });
    });
    // app.post('/api/signout', (req, res) => {
    //     return killSession(req, res);
    // });

    app.get('/api/login', (req, res) => {
        const [username, password] = [req.query.username, req.query.password];
        console.log('jana on api', username, password)
        
        Users.findOne({username: username}, (err, data) => {
            if (err) {
                return res.status(401).json({
                    status: 'error', error: err, message: "Cannot login"
                })
            } else {
                console.log('data jana', data)

                if (data != null && data.password == password) {
                    return res.status(200).json({
                        status: 'success', data: data
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

    // app.get('/api/checkToken', withAuth, function(req, res) {
    //     var token = req.headers.cookie.split("=")[1];
    //     var decoded = jwt.verify(token, process.env.SECRET);
    //     var email = decode(decoded.emailhash);
        
    //     Users.findByEmail(email, function(err, data) {
    //         res.status(200).json({
    //             firstname: data.firstname,
    //             lastname: data.lastname,
    //             email: data.email,
    //             isAdmin: data.admin,
    //             id: data._id
    //         });
    //     });
    // });
};