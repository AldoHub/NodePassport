const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    username: {type: String, required: true}, 
    email: {type: String, required: true},  
    password: {type: String, required: true}, 
    avatar: {type: String, required: true}
});


//create and export the model
module.exports = mongoose.model("User", userSchema);
