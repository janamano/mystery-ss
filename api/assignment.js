require('dotenv').config()
var Assignments = require("../db/Assignment");
var CryptoJS = require("crypto-js");

const decrypt = (data) => {
    // console.log('---------------------')
    // console.log(data)
    // console.log(process.env.SECRET)

    var bytes  = CryptoJS.AES.decrypt(data, process.env.SECRET);  // pass IV
    // console.log(bytes.toString(CryptoJS.enc.Utf8))
    // console.log('---------------------')

    return bytes.toString(CryptoJS.enc.Utf8);
}
function encrypt(data) {
    var bytes  = CryptoJS.AES.encrypt(data, process.env.SECRET);
    return bytes.toString();
}

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
                assignee: encrypt(formData.assignments[key]),
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
        const username = req.query.username
        Assignments.find({}, (err, data) => {
            for (let i = 0; data.length - 1; i++) {
                console.log(data)
                Assignments.findOneAndUpdate({user: data[i].user}, {assignee: decrypt(data[i].assignee)}, {new: true}, (err, data) => {
                    console.log(data)
                })
            }
        })
        Assignments.find({user: username}, (err, data) => {
            // console.log(data)
            if (err || !data || data.length == 0) {
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