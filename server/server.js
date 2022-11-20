const express = require("express");
const app = express();
const cors = require("cors");
var mongoose = require('mongoose');
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
console.log('jana', process.env.PORT)
app.use(cors());
app.use(express.json());
// app.use(require("./routes/record"));
// get driver connection
// const dbo = require("./db/conn");
const Db = 'mongodb+srv://mongo:o3SGmWbYpbxTs631@cluster0.ocoikp9.mongodb.net/secretsanta?retryWrites=true';
 
// connects our back end code with the database
mongoose.connect(Db, { useNewUrlParser: true, useUnifiedTopology: true}).catch(function (reason) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});
const user = require('./api/user.js')(app);
const assignments = require('./api/assignment.js')(app);

app.listen(port, () => {
  // perform a database connection when server starts
//   dbo.connectToServer(function (err) {
//     if (err) console.error(err);
 
//   });
  console.log(`Server is running on port: ${port}`);
});