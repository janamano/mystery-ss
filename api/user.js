require('dotenv').config()
const emailExistence = require('email-existence');
var Users = require("../db/User");
var Groups = require("../db/Group");
const bcrypt = require('bcrypt')
const saltRounds = 10;


function signup({email, username, password, isHost, group, req}) {
    return Users.findOne({ email })
    .then(existingUser => {
        if (existingUser) {
            throw new Error('Email is already in use');
        }
    })
    .then(async () => {
        const userNameUser = await Users.findOne({ username });
        if (userNameUser) {
            throw new Error('Username is already in use');
        }
        return bcrypt.genSalt(saltRounds)
        .then((salt) => {
            return bcrypt.hash(password, salt)
        })
        .then((encryptedPassword) => {
            const user = new Users({
                email: email,
                username: username,
                password: encryptedPassword,
                isHost: isHost,
                group: group,
            });
            return user.save()
        })
    })
    .then(user => {
        return new Promise((resolve, reject) => {
            console.log('jana here', user);


            req.req.session.user = user
            req.req.session.save(() => {
                console.log(req.req.session)
                resolve(user)
            })
            
        });
    });
}

function login({username, password, req}) {
    return Users.findOne({ username })
    .then(dbUser => {
        if (!dbUser) {
            throw new Error('Invalid Credentials')
        }
        return bcrypt.compare(password, dbUser.password).then(function(result) {
            if (result == false) {
                throw new Error('Invalid Credentials')
            } else {
                return new Promise((resolve, reject) => {
                    req.req.session.user = dbUser
                    req.req.session.save(() => {
                        console.log(req.req.session)
                        resolve(dbUser)
                    })
                })
            }
        });
    }) 
}


function joinGroup({ groupID, req }) {
    var currentUser = req.req.session.user;
    // we have to be logged in to create a group
    if (currentUser == null) {
        throw new Error('not authorized to do this action')
    }
    // user can only be in one group (for now)
    if (currentUser.group != null) {
        throw new Error('already in a group')
    }
    return Groups.findOne({ groupID })
    .then((group) => {

        if (group == null) {
            throw new Error('This group does not exist')
        }
        const filter = { username: currentUser.username };
        const update = { isHost: false, group: groupID }
        return Users.findOneAndUpdate(filter, update, { new: true })
            .then((user) => {
                return new Promise((resolve, reject) => {
                    req.req.session.user = user
                    req.req.session.save(() => {
                        resolve(user)
                    })
                })
    
            })
    })

}

module.exports = { signup, login, joinGroup }