const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientProfile = new Schema({
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
    title: {
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
    }
})

module.exports = mongoose.model('PatientProfile', patientProfile)