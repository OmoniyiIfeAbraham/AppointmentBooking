const express = require('express')
const router = express.Router()

const resetMod = require('./../../../models/doctor/auth/reset')
const resetAuthMod = require('./../../../models/doctor/auth/resetAuth')

const bcrypt = require('bcrypt')
const token = require('@supercharge/strings')
const mailer = require('nodemailer')

const systemMail = mailer.createTransport({
    service: process.env.service,
    host: process.env.host,
    port: 465,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
})

router.get('/', (req, res) => {
    res.render('doctor/auth/reset', { msg: '' })
})

router.post('/', )

module.exports = router