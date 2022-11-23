const express = require('express')

const router = express.Router()

const doctorMod = require('./../../models/doctor/profile/profile')
const patientMod = require('./../../models/patient/profile/profile')
const scheduleMod = require('./../../models/doctor/schedule/schedule')

router.get('/', (req, res) => {
    res.render('admin/adminLogin', { emailMsg: '', passwordMsg: '', msg: '' })
})

router.post('/', async(req, res) => {
    const sess = req.session
    const adminEmail = process.env.adminEmail
    const adminPassword = process.env.password
    const email = req.body.email
    const password = req.body.password
    if (password.length < 6) {
        res.render('admin/adminLogin', { emailMsg: '', passwordMsg: 'Password must be 6 characters or More', msg: '' })
    } else if (email != adminEmail && password != adminPassword) {
        res.render('admin/adminLogin', { emailMsg: '', passwordMsg: '', msg: 'Email and Password are Incorrect'})
    } else if (email != adminEmail) {
        res.render('admin/adminLogin', { emailMsg: 'Email is Incorrect', passwordMsg: '', msg: '' })
    } else if (password != adminPassword) {
        res.render('admin/adminLogin', { emailMsg: '', passwordMsg: 'Password is Incorrect', msg: '' })
    } else {
        const doctors = await doctorMod.find()
        const patients = await patientMod.find()
        const schedules = await scheduleMod.find()
        sess.email = email
        sess.password = password
        sess.identifier = process.env.identifier
        // console.log(sess)
        res.render('admin/home', { doctors, patients, schedules })
    }
})

module.exports = router