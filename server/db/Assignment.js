require('dotenv').config()
var mongoose = require('mongoose');

let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

/**
 * Assignment Schema
 */
var assignmentSchema = new Schema({
    user: {
        required: true,
        unique: true,
        type: String
    },
    assignee: {
        required: true,
        unique: true,
        type: String
    },
    group: {
        type: String
    },
},
{ timestamps: true });


module.exports = mongoose.model('Assignment', assignmentSchema);