require('dotenv').config()
const emailExistence = require('email-existence');
var Wishes = require("../db/Wish");

function createWish(wish, callback) {
    // var salt = bcrypt.genSaltSync(15);
    // var pass = bcrypt.hashSync(data.password, salt);
    Wishes.create(wish, callback);  
}

module.exports = function(app) {

    app.get('/api/getWishes', (req, res) => {
        const user = req.query.username;
        console.log('query', req.query)
        Wishes.find({username: user}, (err, data) => {
            if (err) {
                return res.status(401).json({
                    status: 'error', error: err, message: "Cannot get wishes"
                })
            } else {
                return res.status(200).json({
                    status: 'success', data: data
                }) 

            }
        });
    });

    app.post('/api/createWish', (req, res) => {
        console.log('jmaney')
        var wish = {
            username: req.body.username,
            wishName: req.body.wishName,
            wishLink: req.body.wishLink,
        }
        createWish(wish, (err, data) => {
            if (err) {
                return res.status(400).json({status: 'error', error: err, msg:"Failed to create wish."});
            } else {
                console.log('janajana' , res.data)
                return res.status(200).json({status: 'success', data: data});
            } 
        })
    });

    app.put('/api/deleteWish', (req, res) => {
        Wishes.findByIdAndDelete(req.body.wishId, (err, data) => {
            if (err) {
                return res.status(400).json({status: 'error', error: err, msg:"Failed to delete wish."});
            } else {
                return res.status(200).json({status: 'delete success', data: data});
            }
        })
    });

    app.delete('/api/changeWish', (req, res) => {
        var wish = {
            wishName: req.body.wishName,
            wishLink: req.body.wishLink,
        }
        Wishes.findByIdAndUpdate(req.body.wishId, wish, {new: true}, (err, data) => {
            if (err) {
                return res.status(400).json({status: 'error', error: err, msg:"Failed to update wish."});
            } else {
                return res.status(200).json({status: 'change success', data: data});
            }
        })
    });
};