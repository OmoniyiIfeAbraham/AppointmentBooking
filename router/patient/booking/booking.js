const express = require('express')
const router = express.Router()

const bookingMod = require('./../../../models/patient/bookings/bookings')
const scheduleMod = require('./../../../models/doctor/schedule/schedule')
const profileMod = require('./../../../models/patient/profile/profile')
const doctorProfileMod = require('./../../../models/doctor/profile/profile')


router.post('/:SID/:DID/:PID', async(req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'patient') {
        const SID = req.params.SID
        const DID = req.params.DID
        const PID = req.params.PID
        const startTime = req.body.start
        const endTime = req.body.end
        const S = new Date(startTime)
        const E = new Date(endTime)
        const S1 = S.getTime()
        const E1 = E.getTime()
        const person = await profileMod.findById({ _id: PID })
        const schedules = await scheduleMod.find().sort({ createdAt: -1 })
        const doctors = await doctorProfileMod.find()
        const bookings = await bookingMod.find({ patientID: person._id }).sort({ createdAt: -1 })
        const ids = []
        bookings.forEach(booking => {
            ids.push(booking.scheduleID)
        })
        console.log(ids)
        const info = []
        for (id = 0; id <= ids.length; id++) {
            console.log(ids[id])
            const one = ids[id]
            if (one == undefined) {
                break;
            } else {
                const times = await scheduleMod.findById({ _id: one })
                console.log(times)
                info.push(times)
            }
        }
        console.log(info)
        try {
            const find = await scheduleMod.findById({ _id: SID })
            console.log(find)
            if(S1 == E1) {
                res.render('patient/profile/profile', { msg: "Your Start and End Time/Date Cannot be Equal", person, schedules, doctors, bookings, info })
            } else if (E1 < S1) {
                res.render('patient/profile/profile', { msg: "End Time/Date Cannot be lesser than Start Time/Date", person, schedules, doctors, bookings, info })
            } else if (S1 >= new Date(find.start).getTime() && E1 <= new Date(find.end).getTime()) {
                const single = await bookingMod.findOne({ start: startTime, end: endTime })
                if (single) {
                    res.render('patient/profile/profile', { msg: 'Time/Date is Already Booked', person, schedules, doctors, bookings, info })
                } else {
                    const once  = await bookingMod.findOne({ patientID: PID, scheduleID: SID})
                    if (once) {
                        res.render('patient/profile/profile', { msg: "You Already have a Booking Reserved for this Appointment Schedule", person, schedules, doctors, bookings, info })
                    } else {
                        const booking = new bookingMod({
                            scheduleID: SID,
                            doctorID: DID,
                            patientID: PID,
                            start: startTime,
                            end: endTime
                        })
                        await booking.save()
                        res.redirect('/patient')
                    }
                }
            } else {
                res.render('patient/profile/profile', { msg: `Time/Date must be between ${new Date(find.start).toLocaleString()} and ${new Date(find.end).toLocaleString()}`, person, schedules, doctors, bookings, info })
            }
        } catch (err) {
            console.log(err)
            res.render('patient/profile/profile', { msg: `${err.message}`, person, schedules, doctors, bookings, info })
        }
    } else {
        res.redirect('/patientLogin')
    }
})

module.exports = router