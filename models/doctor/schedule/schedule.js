const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schedule = new Schema({
    doctor: {
        type: String,
        uniqueID: true,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('schedule', schedule)