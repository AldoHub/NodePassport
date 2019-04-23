const passport = require("passport");
//const Mongoose = require("mongoose");
const User = require("../models/User"); 
let LocalStrategy = require("passport-local").Strategy;

//bcrypt
const bcrypt = require("bcrypt");

//-------- use the LocalStrategy
passport.use(new LocalStrategy (
    //username and password are the name
    //of the fields in the login form
    function(username, password, done){
        //check if data is being passed
        console.log(`
        ----------USERNAME: ${username},
        ----------PASSWORD: ${password}
        `);

        

        User.find().where("username").equals(username).then((user)=>{
            
        
            if(user.length == 0){
                console.log("user not found");
                return done(null, false);
            }else{
                console.log(user);
            
            let userPassword = password;
            let passwordHash = user[0]["password"]; //heres the problem
            


            console.log(userPassword, passwordHash);
            bcrypt.compare(userPassword, passwordHash, (err, response)=>{
                //if theyre match auth the user 
                if(response===true){
                    console.log(response);
                    // this property user_id is created for passport to have it
                    // then we can access it using the req.user.user_id
                    // from the user object created by passport
                    return done(null,{user_id: user[0]._id });
                  
                }else{
                    //else cancel auth
                    console.log(err);
                    return done(null, false);
                }
            });     
        
        }
        }).catch(err => {
            console.log(err)
        });
       
    }
));

passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });
  
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
  
});