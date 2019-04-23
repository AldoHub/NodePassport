const express= require("express");
const router= express.Router();
//use the model
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

router.get("/users/profile", authMiddleware() ,(req,res)=>{
    //get the property user_id from passport
    //stored inside the user obj and stores the current user
    let passportId = req.user.user_id || req.session.passport.user;
    console.log(passportId);
    
    
    //query the user using the id (ewhich matches the id inside the database)
    User.findById(passportId, (err, user) => {
        if(err){
            console.log("error fetching the user info ", err)
        }else{
            req.session.user = user["username"];
          

            console.log("SESION", req.session);
            res.render("profile", {user: user});
        }
        
    })
    
    
});


module.exports= router;