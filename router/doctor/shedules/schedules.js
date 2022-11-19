const express = require('express')
const router = express.Router()

const check = require('node-schedule')

const scheduleMod = require('./../../../models/doctor/schedule/schedule')
const bookingMod = require('./../../../models/patient/bookings/bookings')

router.get('/:id', async(req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        const schedules = await scheduleMod.find({ doctor: req.params.id }).sort({ createdAt: -1 })
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
                        console.log('Booking deleted from schedule of doctor')
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
        res.render('doctor/schedules/schedules', { msg: '', id: req.params.id, schedules })
    } else {
        res.redirect('/doctorLogin')
    }
})

router.post('/:id', async(req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        console.log(req.body)
        const schedules = await scheduleMod.find({ doctor: req.params.id }).sort({ createdAt: -1 })
        const id = req.params.id
        const start = req.body.start
        // console.log(start)
        const a = new Date(start)
        // console.log(a.toDateString())
        const end = req.body.end
        const b = new Date(end)
        const Time = new Date()
        // console.log(Time.toISOString())
        let ms1 = Time.getTime() // current
        let ms2 = a.getTime() // start
        let ms3 = b.getTime() // end
        console.log(ms2 < ms1)
    
        // check.scheduleJob('*/2 * * * * *', () => {
        //     console.log('I ran')
        // })
        try{
            if (start != null && end != null) {
                const sameStart = await scheduleMod.findOne({ doctor: id, start: start })
                const sameEnd = await scheduleMod.findOne({ doctor: id, end: end })
                const same = await scheduleMod.find({ doctor: id })
                if (same.length > 0) {
                    for (let i = 0; i <= same.length; i++) {
                        console.log(same[i])
                        const look = same[i]
                        // console.log(look.start + 'look Start')
                        const S = new Date(look.start)
                        const E = new Date(look.end)
                        console.log(S + 'SSS')
                        console.log(E + 'EEE')
                        if (S.getTime() <= ms2 && E.getTime() >= ms3) {
                            res.render('doctor/schedules/schedules', { msg: 'Schedule Cant be In-Between Another Schedule', id, schedules })
                            break;
                        } else {
                            async function much() {
                                if (sameStart && sameEnd) {
                                    res.render('doctor/schedules/schedules', { msg: 'Schedule is already Occupied', id, schedules })
                                } else {
                                    if (ms2  < ms1) {
                                        res.render('doctor/schedules/schedules', { msg: 'Start Date/Time Cannot be less than Current Date/Time', id, schedules })
                                    } else {
                                        if (ms3 < ms1) {
                                            res.render('doctor/schedules/schedules', { msg: 'End Date/Time Cannot be less than Current Date/Time', id, schedules })
                                        } else {
                                            if (ms3 < ms2) {
                                                res.render('doctor/schedules/schedules', { msg: 'End Date/Time Cannot be less than Start Date/Time', id, schedules })
                                            } else {
                                                if (ms2 == ms3) {
                                                    res.render('doctor/schedules/schedules', { msg: 'Start Date/Time Cannot be equal to End Date/Time', id, schedules })
                                                } else {
                                                    const schedule = new scheduleMod({
                                                        doctor: id,
                                                        start: start,
                                                        end: end
                                                    })
                                                    await schedule.save()
                                                    check.scheduleJob(a, () => {
                                                            scheduleMod.findByIdAndUpdate({ _id: schedule._id }, { active: true }, (err, docs) => {
                                                                if (err) {
                                                                    console.log(err)
                                                                    next(err)
                                                                } else {
                                                                    // res.redirect(`/schedules/${id}`)
                                                                }
                                                            })
                                                        })
                                                        check.scheduleJob(b, () => {
                                                            scheduleMod.findByIdAndDelete({ _id: schedule._id }, (err, docs) => {
                                                                if (err) {
                                                                    console.log(err)
                                                                    next(err)
                                                                } else {
                                                                    // res.redirect(`/schedules/${id}`)
                                                                }
                                                            })
                                                    })
                                                    res.redirect(`/schedules/${id}`)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            much()
                        }
                        break;
                    }
                } else {
                            async function much() {
                                if (sameStart && sameEnd) {
                                    res.render('doctor/schedules/schedules', { msg: 'Schedule is already Occupied', id, schedules })
                                } else {
                                    if (ms2  < ms1) {
                                        res.render('doctor/schedules/schedules', { msg: 'Start Date/Time Cannot be less than Current Date/Time', id, schedules })
                                    } else {
                                        if (ms3 < ms1) {
                                            res.render('doctor/schedules/schedules', { msg: 'End Date/Time Cannot be less than Current Date/Time', id, schedules })
                                        } else {
                                            if (ms3 < ms2) {
                                                res.render('doctor/schedules/schedules', { msg: 'End Date/Time Cannot be less than Start Date/Time', id, schedules })
                                            } else {
                                                if (ms2 == ms3) {
                                                    res.render('doctor/schedules/schedules', { msg: 'Start Date/Time Cannot be equal to End Date/Time', id, schedules })
                                                } else {
                                                    const schedule = new scheduleMod({
                                                        doctor: id,
                                                        start: start,
                                                        end: end
                                                    })
                                                    await schedule.save()
                                                    check.scheduleJob(a, () => {
                                                            scheduleMod.findByIdAndUpdate({ _id: schedule._id }, { active: true }, (err, docs) => {
                                                                if (err) {
                                                                    console.log(err)
                                                                    next(err)
                                                                } else {
                                                                    // res.redirect(`/schedules/${id}`)
                                                                }
                                                            })
                                                        })
                                                        check.scheduleJob(b, () => {
                                                            bookingMod.findOneAndDelete({ scheduleID: schedule._id }, (err, docs) => {
                                                                if (err) {
                                                                    console.log(err)
                                                                    next(err)
                                                                } else { 
                                                                    console.log('Booking deleted from regular')
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
                                                            //         // res.redirect(`/schedules/${id}`)
                                                            //     }
                                                            // })
                                                    })
                                                    res.redirect(`/schedules/${id}`)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            much()
                        // }
                    // }
                }
            } else {
                res.render('doctor/schedules/schedules', { msg: 'Fill all the Fields', id, schedules })
            }
        } catch (err) {
            console.log(err)
            res.render('doctor/schedules/schedules', { msg: `${err.message}` , id, schedules })
        }
    } else {
        res.redirect('/doctorLogin')
    }
})

module.exports = router