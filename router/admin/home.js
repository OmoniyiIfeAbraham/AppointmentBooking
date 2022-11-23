const express = require('express')

const router = express.Router()

const doctorMod = require('./../../models/doctor/profile/profile')
const patientMod = require('./../../models/patient/profile/profile')
const scheduleMod = require('./../../models/doctor/schedule/schedule')

router.get('/', async (req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'admin') {
        const doctors = await doctorMod.find()
        const patients = await patientMod.find()
        const schedules = await scheduleMod.find()
        res.render('admin/home', { doctors, patients, schedules })
    } else {
        res.redirect('/adminLogin')
    }
})

module.exports = router