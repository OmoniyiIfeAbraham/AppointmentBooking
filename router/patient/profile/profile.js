const express = require('express')
const router = express.Router()

const registerMod = require('./../../../models/patient/auth/register')
const profileMod = require('./../../../models/patient/profile/profile')
const scheduleMod = require('./../../../models/doctor/schedule/schedule')
const doctorProfileMod = require('./../../../models/doctor/profile/profile')

const bookingMod = require('./../../../models/patient/bookings/bookings')

const remarkMod = require('./../../../models/remarks/remarks')

router.get('/', async(req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'patient') {
        const schedules = await scheduleMod.find().sort({ createdAt: -1 })
        const doctors = await doctorProfileMod.find()
        const Time = new Date()
        schedules.forEach(schedule => {
            const a = new Date(schedule.start)
            const b = new Date(schedule.end)
            let ms1 = Time.getTime()
            let ms2 = a.getTime()
            let ms3 = b.getTime()
            // console.log(ms2 < ms1)
            if (ms2 < ms1 && ms3 < ms1) {
                // console.log('one')
                scheduleMod.findByIdAndDelete({ _id: schedule._id }, (err, docs) => {
                    if (err) {
                        console.log(err)
                        next(err)
                    } else {
                        // res.render('doctor/schedules/schedules', { msg: '', id: req.params.id, schedules })
                    }
                })
                bookingMod.findOneAndDelete({ scheduleID: schedule._id }, (err, docs) => {
                    if (err) {
                        console.log(err)
                        next(err)
                    } else { 

                    }
                })
            } else if (ms2 < ms1) {
                // console.log('two')
                if (schedule.active == false) {
                    scheduleMod.findByIdAndUpdate({ _id: schedule._id }, { active: true }, (err, docs) => {
                        if (err) {
                            console.log(err)
                            next(err)
                        } else {
                            // res.render('doctor/schedules/schedules', { msg: '', id: req.params.id, schedules })
                        }
                    })
                } else {
                    console.log('Already Met')
                }
            } else {
                console.log('Pending')
            }
        })
        try {
            // const names = []
            // for (let i = 0; i <= schedules.length; i++) {
            //     const unique = schedules[i]
            //     const find = unique.doctor
            //     const check = await doctorProfileMod.findById({ _id: find })
            //     const fullName = `${check.firstname} ${check.lastname}`
            //     names.push(fullName)
            // }
            // console.log(names)
            const profile = await registerMod.findOne({ email: sess.email })
            console.log(profile)
            if (profile.completeProfile == false) {
                const id = profile._id
                console.log(id)
                res.render('patient/profile/completeProfile', { id, msg: '' })
            } else {
                const person = await profileMod.findOne({ uniqueID: profile._id })
                console.log(person._id + " This is the ID OOOOOOOOO")
                const bookings = await bookingMod.find({ patientID: person._id }).sort({ createdAt: -1 })
                console.log(bookings)
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
                    } else if (one == null) {
                        break;
                    } else {
                        const times = await scheduleMod.findById({ _id: one })
                        if (times == null) {
                            break;
                        } else {
                            console.log(times)
                            info.push(times)
                        }
                    }
                }
                // console.log(info.length)
                const remarks = await remarkMod.find()
                res.render('patient/profile/profile', { msg: ' ', person, schedules, doctors, bookings, info, remarks })
            }
        } catch(err) {
            console.log(err)
            res.render('patient/auth/login', { msg: `${err.message}`})
        }
        // res.render('patient/profile/profile')
    } else {
        res.redirect('/patientLogin')
    }
})

module.exports = router