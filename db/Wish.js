require('dotenv').config()
var mongoose = require('mongoose');

let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

/**
 * Wish Schema
 */
var wishSchema = new Schema({
    username: {
        required: true,
        type: String,
    },
    wishName: {
        required: true,
        type: String,
    },
    wishLink: {
        type: String,
    },
},
{ timestamps: true });


module.exports = mongoose.model('Wish', wishSchema);