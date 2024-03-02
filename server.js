const express = require("express");
const app = express();
var mongoose = require('mongoose');
const MongoStore = require('connect-mongo')
const  createHandler = require('graphql-http/lib/use/express').createHandler;
require("dotenv").config();
const port = process.env.PORT || 5000;
const schema = require('./schema/schema');
const expressPlayground =
  require('graphql-playground-middleware-express').default;
const { ApolloServer } = require('apollo-server-express');

app.use(express.json());

const path = require("path");
const session = require("express-session");

const Db = process.env.MONGO_URL;
// console.log('jana', Db);
// connects our back end code with the database
mongoose.connect(Db, { useNewUrlParser: true, useUnifiedTopology: true}).catch(function (reason) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});


app.use(
  session({
    name: 'qid',
    resave: false,
    saveUninitialized: false,
    secret: 'ilovedoggos',
    store: MongoStore.create({
      mongoUrl: Db
    })
  })
)


const apollo = new ApolloServer({
  schema,
  context: ({req, res}) => ({
    req
  }),
});

apollo.start().then(() => {
  apollo.applyMiddleware({ app })
})

app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});