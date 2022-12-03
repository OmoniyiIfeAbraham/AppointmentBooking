const express = require('express')
const router = express.Router()

const auto = require('node-schedule')

const patientMod = require('./../../models/patient/profile/profile')
const doctors = require('./../../models/doctor/profile/profile')
const remarkMod = require('./../../models/remarks/remarks')
const scheduleMod = require('./../../models/doctor/schedule/schedule')
const bookingMod = require('./../../models/patient/bookings/bookings')

router.get('/', (req, res) => {
    console.log('Iya ooooo')
})

router.post('/p/:sender/:receiver', async(req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'patient') {
        console.log(req.body)
        console.log(req.params.sender)
        console.log(req.params.receiver)
        const message = req.body.message
        const sender = req.params.sender
        const receiver = req.params.receiver
        try {
            if (message != null) {
                const remark = new remarkMod({
                    from: sender,
                    to: receiver,
                    message: message
                })
                await remark.save()
                res.redirect(`/patient#remark/${sender}/${receiver}`)
            } else {
                res.redirect(`/patient#remark/${sender}/${receiver}`)
            }
        } catch (err) {
            console.log(err)
            next(err)
            res.redirect(`/patient#remark/${sender}/${receiver}`)
        }
    } else {
        res.redirect('/patientLogin')
    }

})

router.post('/d/:sender/:receiver/:id', async(req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        console.log(req.body)
        console.log(req.params.sender)
        console.log(req.params.receiver)
        const message = req.body.message
        const sender = req.params.sender
        const receiver = req.params.receiver
        const schedule = await scheduleMod.findById({ _id: req.params.id})
        const bookings = await bookingMod.find({ scheduleID: req.params.id }).sort({ createdAt: -1 })
        const patients = await patientMod.find()
        const remarks = await remarkMod.find()
        try {
            if (message != null) {
                const remark = new remarkMod({
                    from: sender,
                    to: receiver,
                    message: message
                })
                await remark.save()
                res.redirect(`/viewSchedule/${req.params.id}#remark/${sender}/${receiver}`)
            } else {
                res.render('doctor/schedules/viewSchedule', { schedule, bookings, patients, remarks, msg: 'Message cannot be Empty' })
            }
        } catch (err) {
            console.log(err)
            next(err)
            res.render('doctor/schedules/viewSchedule', { schedule, bookings, patients, remarks, msg: 'An Error Occured!!!' })
        }
    } else {
        res.redirect('/doctorLogin')
    }

})

module.exports = router