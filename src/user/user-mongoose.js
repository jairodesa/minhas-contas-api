const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    useremailVerified: {
        type: Number,
        required: true,
        default: false
    },
    userDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})
module.exports = mongoose.model('User', userSchema)