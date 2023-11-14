const express = require("express");
const app = express();
const cors = require("cors");
var mongoose = require('mongoose');
require("dotenv").config();
const port = process.env.PORT || 5000;
console.log('jana', port)

app.use(express.json());
const path = require("path")
let server = require('http').Server(app);
app.use(cors( {
  origin: (origin, callback) => {
    if ('https://mystery-santa.onrender.com'.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
      } else {
          callback(new Error('Not allowed by CORS'))
      }
  },
  credentials: true,
  optionsSuccessStatus: 200
}))
// var https = require('https');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
// app.use(require("./routes/record"));
// get driver connection
// const dbo = require("./db/conn");
const Db = process.env.MONGO_URL;
console.log('jana', Db);
// connects our back end code with the database
mongoose.connect(Db, { useNewUrlParser: true, useUnifiedTopology: true}).catch(function (reason) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});
const user = require('./api/user.js')(app);
const assignments = require('./api/assignment.js')(app);
const groups = require('./api/group.js')(app);
const wishes = require('./api/wish.js')(app);

app.use(express.static(path.join(__dirname, "client", "build")))

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


server.listen(port, () => {
  // perform a database connection when server starts
//   dbo.connectToServer(function (err) {
//     if (err) console.error(err);
 
//   });
  console.log(`Server is running on port: ${port}`);
});
// app.listen(port, () => {
//   // perform a database connection when server starts
// //   dbo.connectToServer(function (err) {
// //     if (err) console.error(err);
 
// //   });
//   console.log(`Server is running on port: ${port}`);
// });