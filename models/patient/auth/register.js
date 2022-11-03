const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientRegister = new Schema({
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
    completeProfile: {
        type: Boolean,
        required: true,
        default: false
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    profilePublicID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('PatientRegister', patientRegister)