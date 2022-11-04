const mongoose = require('mongoose')

const Schema = mongoose.Schema

const doctorProfile = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePublicID: {
        type: String,
        required: true
    },
    uniqueID: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    stateOfOrigin: {
        type: String,
        required: true
    },
    maritalStatus: {
        type: String,
        required: true
    },
    permit: {
        type: String,
        required: true
    },
    permitPublicID: {
        type: String,
        required: true
    },
    identity: {
        type: String,
        required: true,
        default: ' '
    },
    identityPublicID: {
        type: String,
        required: true,
        default: ' '
    }
})

module.exports = mongoose.model('DoctorProfile', doctorProfile)