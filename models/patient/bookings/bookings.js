const mongoose = require('mongoose')

const Schema = mongoose.Schema

const booking = new Schema({
    scheduleID: {
        type: String,
        required: true
    },
    doctorID: {
        type: String,
        required: true
    },
    patientID: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true 
    }
}, { timestamps: true })

module.exports = mongoose.model('booking', booking)