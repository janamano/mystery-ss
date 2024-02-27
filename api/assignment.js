require('dotenv').config()
var Assignments = require("../db/Assignment");

module.exports = function(app) {

    // Authentication
    app.post('/api/createAssignment', (req, res) => {
        var formData = req.body;
        console.log(req.body)
        for (var key in formData.assignments) {
            console.log('pay', {
                user: key.toString(),
                assignee: formData.assignments[key],
                group: formData.group 
            })
            // let current = formData.assignments[i];
            Assignments.create({
                user: key.toString(),
                assignee: formData.assignments[key],
                group: formData.group 
            }, (err, data) => {
                if (err) {
                    return res.status(400).json({status: 'error', error: err, msg:"Failed to create user."});
                // todo
                } 
            });
        }
        return res.status(200).json({status: 'success', msg:"okay"});

    });
    app.get('/api/getAssignee', (req, res) => {
        console.log('requester:', req.query.requester != null ? req.query.requester : '');
        console.log('assignee:', req.query.username)

        const username = req.query.username
        Assignments.find({user: username}, (err, data) => {
            // console.log(data)
            if (err) {
                return res.status(401).json({
                    status: 'error', error: err, message: "nice try"
                })
            } else {
                return res.status(200).json({
                    status: 'success', data: data
                }) 

            }
        });
    });
};