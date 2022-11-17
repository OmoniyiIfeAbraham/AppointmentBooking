const express = require('express')
const router = express.Router()

const scheduleMod = require('./../../../models/doctor/schedule/schedule')
const bookingMod = require('./../../../models/patient/bookings/bookings')
const profileMod = require('./../../../models/patient/profile/profile')
const remarkMod = require('./../../../models/remarks/remarks')

router.get('/:id', async(req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        const id = req.params.id
        const schedule = await scheduleMod.findById({ _id: id })
        const bookings = await bookingMod.find({ scheduleID: id }).sort({ createdAt: -1 })
        const patients = await profileMod.find()
        const remarks = await remarkMod.find()

    } else {        res.render('doctor/schedules/viewSchedule', { schedule, bookings, patients, remarks })
        res.redirect('/doctorLogin')
    }
})

module.exports = router