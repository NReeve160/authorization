const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");

//check database connection or not
connect.then(() => { 
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be connected");
});

//Create Schema

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

//collection Part
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;