const express = require('express')
const router = express.Router()

const scheduleMod = require('./../../../models/doctor/schedule/schedule')
const bookingMod = require('./../../../models/patient/bookings/bookings')
const profileMod = require('./../../../models/patient/profile/profile')
const doctorProfileMod = require('./../../../models/doctor/profile/profile')

router.get('/:id', async (req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'admin') {
        const id = req.params.id
        const schedule = await scheduleMod.findById({ _id: id })
        const bookings = await bookingMod.find({ scheduleID: id }).sort({ createdAt: -1 })
        const patients = await profileMod.find()
        const doctors = await doctorProfileMod.find()
        res.render('admin/schedules/viewSchedule', { schedule, bookings, patients, doctors })
    } else {
        res.redirect('/adminLogin')
    }
})

module.exports = router