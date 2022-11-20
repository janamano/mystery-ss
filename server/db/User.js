require('dotenv').config()
var mongoose = require('mongoose');

let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

/**
 * User Schema
 */
var userSchema = new Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    username: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String,
    },
    group: {
        type: String
    },
    isHost: {
        type: Boolean
    }
},
{ timestamps: true });


module.exports = mongoose.model('User', userSchema);