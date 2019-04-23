const express= require("express");
const router= express.Router();
const connection = require("../connection/connection");
const fs=require("fs");
const Mongoose = require("mongoose");

//multer for the users
const upload= require("../multer/users");

//bcrypt
var bcrypt = require('bcrypt');
const saltRounds = 10;

//require passport
let passport= require("passport");

//mongoose Model
let User = require("../models/User");


router.get("/",(req,res)=>{
    //render the registration page  
    res.render("registration");
});



router.post("/users/register", (req,res, next)=>{
 
    
    if(connection.error == null || connection.error == undefined){
        
        //manage the upload of the file first
        upload(req, res, (err) => {
            console.log(req);
            if(req.body.email == "" || req.body.password == ""){
                res.render("registration" , {
                    error: "All inputs are required"
                });
            }else{
               //if theres an erro with the image upload
               if(err){
                    //re-render the form
                    res.render("./registration", {
                        err: "The image was not uploaded due an error: " + error 
                    });
               }else{
                    //else form was sent correctly    
                    //get the user details
                    let username = req.body.username;
                    let email = req.body.email;
                    let password = req.body.password;
                    let avatar = req.file.filename;  


                    //hash the password to be stored in the database
                    let passwordHash = bcrypt.hashSync(password, saltRounds);

                    //add the user to MongoDB
                    let user = new User({
                        _id: new Mongoose.Types.ObjectId(),
                        username : username,
                        avatar: avatar,
                        password: passwordHash,
                        email: email
                    });

                    //save the user
                    user.save((err) => {
                        if(err) {
                            res.render("./registration", {
                                err: "Unable to connect to the database, the user was not saved"
                            });  
                            //delete the file here using unlinkSync
                        }else{
                            //search for the user and log him in
                            console.log(user._id);
                            req.session.user = user["username"];
                            console.log(req.session);
                            User.findById(user._id, (err, user) => {
                               //log the user in
                                
                               req.login(user._id, ()=>{
                                    //send the user to his profile
                                    res.redirect("/users/profile");    

                                });    
                            })
                        }
                    })
               }
            }
        })
    
    
    }else{
         // redirect and display the next error
         res.render("/registration", {
            err: "The database could not be reached, no changes were saved."
        });
    }
    
    
     
});

module.exports= router;