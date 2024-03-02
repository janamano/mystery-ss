require('dotenv').config()
var Assignments = require("../db/Assignment");


function createAssignment({user, assignee, group, req}) {
    var currentUser = req.req.session.user;
    // we have to be logged in to create a group
    if (currentUser == null) {
        throw new Error('not authorized to do this action')
    }
    var newAssignment = new Assignments({
        user,
        assignee,
        group
    })

    return newAssignment.save();
} 

function getAssignment({ req }) {
    var currentUser = req.req.session.user;
    // we have to be logged in to create a group
    if (currentUser == null) {
        throw new Error('not authorized to do this action')
    }
    
    return Assignments.findOne({user: currentUser.username, group: currentUser.group}).
    then((assignment) => {
        return new Promise((res, rej) => {
            if (assignment) {
                res(assignment)
            } else {
                res(null)
            }
        })
    })


    return newAssignment.save();
} 

module.exports = { createAssignment, getAssignment }