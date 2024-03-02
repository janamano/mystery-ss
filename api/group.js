require('dotenv').config()
const emailExistence = require('email-existence');
var randomstring = require("randomstring");
var Users = require("../db/User");
var Groups = require("../db/Group");

function createGroup({ groupName, dollarLimit, req }) {
    var currentUser = req.req.session.user;
    // we have to be logged in to create a group
    if (currentUser == null) {
        throw new Error('not authorized to do this action')
    }
    // user can only be in one group (for now)
    if (currentUser.group != null) {
        throw new Error('already in a group')
    }
    const newGroup = new Groups({
        groupName,
        dollarLimit,
        groupID: randomstring.generate(10),
        groupHost: currentUser.username
    })

    return newGroup.save()
    .then(group => {
        return new Promise((resolve, reject) => {
            const filter = {username: currentUser.username};
            const update = {isHost: true, group:group.groupID}
            // update the user in DB
            Users.findOneAndUpdate(filter, update, {
                new: true
            }).then((user) => {
                req.req.session.user = user
                req.req.session.save(() => {
                    resolve(group)
                })
            })
        }) 
    })
}

module.exports = { createGroup }