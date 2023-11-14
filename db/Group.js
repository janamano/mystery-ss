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
var groupSchema = new Schema({
    groupID: {
        required: true,
        type: String,
        unique: true
    },
    groupName: {
        required: true,
        type: String,
    },
    groupHost: {
        required: true,
        type: String,
    },
    dollarLimit: {
        type: Number,
        required: true
    }
},
{ timestamps: true });


module.exports = mongoose.model('Group', groupSchema);