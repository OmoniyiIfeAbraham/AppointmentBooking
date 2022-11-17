const mongoose = require('mongoose')

const Schema = mongoose.Schema

const remark = new Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
}, { timestamps: true })

module.exports = mongoose.model('remark', remark)