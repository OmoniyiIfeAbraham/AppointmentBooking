const mongoose = require('mongoose')
const Schema = mongoose.Schema

const resetDoctorPassword = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('ResetDoctorPassword', resetDoctorPassword)