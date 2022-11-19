const express = require('express')
const router = express.Router()

const scheduleMod = require('./../../../models/doctor/schedule/schedule')
const profileMod = require('./../../../models/doctor/profile/profile')
const bookingMod = require('./../../../models/patient/bookings/bookings')

router.get('/', async(req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'admin') {
        const schedules = await scheduleMod.find().sort({ createdAt: -1 })
        const doctors = await profileMod.find()
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
                bookingMod.findOneAndDelete({ scheduleID: schedule._id }, (err, docs) => {
                    if (err) {
                        console.log(err)
                        next(err)
                    } else { 
                        console.log('Booking Deleted from schedule')
                        scheduleMod.findByIdAndDelete({ _id: schedule._id }, (err, docs) => {
                            if (err) {
                                console.log(err)
                                next(err)
                            } else {
                                // res.render('doctor/schedules/schedules', { msg: '', id: req.params.id, schedules })
                            }
                        })
                    }
                })
                // scheduleMod.findByIdAndDelete({ _id: schedule._id }, (err, docs) => {
                //     if (err) {
                //         console.log(err)
                //         next(err)
                //     } else {
                //         // res.render('doctor/schedules/schedules', { msg: '', id: req.params.id, schedules })
                //     }
                // })
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
        // check.scheduleJob('*/2 * * * * *', () => {
        //     console.log('I ran')
        // })
        res.render('admin/schedules/schedules', { msg: '', schedules, doctors })
    } else {
        res.redirect('/adminLogin')
    }
})

module.exports = router