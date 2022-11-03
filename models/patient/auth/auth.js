const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientAuth = new Schema({
    uniqueID: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
    },
    otp: {
        type: String,
        unique: true,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('PatientAuth', patientAuth)