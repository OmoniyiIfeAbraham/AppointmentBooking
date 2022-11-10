const express = require('express')
const router = express.Router()

const check = require('node-schedule')

const scheduleMod = require('./../../../models/doctor/schedule/schedule')

router.get('/:id', async(req, res, next) => {
    const schedules = await scheduleMod.find().sort({ createdAt: -1 })
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
})

router.post('/:id', async(req, res, next) => {
    console.log(req.body)
    const schedules = await scheduleMod.find().sort({ createdAt: -1 })
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
            if (sameStart != null && sameEnd != null) {
                const S = new Date(sameStart.start)
                const E = new Date(sameEnd.end)
                if (sameStart && sameEnd || ms2 >= S.getTime() && ms3 <= E.getTime()) {
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
            } else {
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
        } else {
            res.render('doctor/schedules/schedules', { msg: 'Fill all the Fields', id, schedules })
        }
    } catch (err) {
        console.log(err)
        res.render('doctor/schedules/schedules', { msg: `${err.message}` , id, schedules })
    }
})

module.exports = router