const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true

    },

    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }

})

const Signup = new mongoose.model("Sign-up", userSchema);
module.exports = Signup;