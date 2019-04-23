require('dotenv').config();
const express = require("express");
const app= express();
const bodyParser= require("body-parser");
var path = require("path");
const connection = require("./connection/connection");

//routes
const profile = require("./routes/profile");
const login = require("./routes/login");
const logout = require("./routes/logout");
const registration = require("./routes/registration");


//mongoose
const mongoose = require("mongoose");
//model 
//const User = require("./models/User");


mongoose.connect(
    connection.connection, { useNewUrlParser: true })
  .then(connection => {
    console.log("connection stablished")
  })
  .catch(error => {
    console.log(connection);
    console.log({
        error : {
            name : error.name,
            message : error.message,
            errorCode: error.code,
            codeName: error.codeName
        }
    })
  });



//express sessions
let session = require('express-session');
//mongo-store
//pass the session to use it
const MongoStore = require("connect-mongo")(session);


//passport and LocalStrategy
let passport= require("passport");

app.use(express.static("./public"));

//set the view engine to PUG
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "pug");





//body parser for the params
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

  
//express sessions
//populates a cookie that will help passport to keep track of the user
//also using mongo-connect in order to add a store
//this store can be used to add information about the user in the session
app.use(session({
    secret: 'YHprvmaIW1',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        //use the same connection
        mongooseConnection: mongoose.connection,
        autoRemoveInterval: 3600
    }),
    //add options to the cookies
    cookie: { maxAge: 180 * 60 * 1000 }
}));

if (app.get('env') === 'production') {
  
    sess.cookie.secure = true // serve secure cookies
}
  

//passport session and initialize
app.use(passport.initialize());
app.use(passport.session());
require('./passport/config'); //require the passport config file




// global property for auth users
// allows us to show or hide things based on wether the user is 
// authenticated or not
app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.isAuthenticated();
    //also add the session to be available elsewhere
    res.locals.session = req.session;
    next();
});


//use the routes
app.use("/", profile);
app.use("/", login);
app.use("/", registration);
app.use("/", logout);


app.listen(8000, ()=>{
    console.log("listening for traffic on port 8000");
});