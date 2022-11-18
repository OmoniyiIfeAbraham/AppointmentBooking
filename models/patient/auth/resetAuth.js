const mongoose = require('mongoose')

const Schema = mongoose.Schema

const resetPatientAuth = new Schema({
    uniqueID: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
        unique: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    }
})

module.exports = mongoose.model('ResetPatientAuth', resetPatientAuth)