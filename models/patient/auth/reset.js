const mongoose = require('mongoose')
const Schema = mongoose.Schema

const resetPatientPassword = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    uniqueID: {
        type: String,
        required: true,
        unique: true,
    }
})

module.exports = mongoose.model('ResetPatientPassword', resetPatientPassword)