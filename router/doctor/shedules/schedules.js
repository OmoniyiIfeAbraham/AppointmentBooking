const express = require('express')
const router = express.Router()

const check = require('node-schedule')

const scheduleMod = require('./../../../models/doctor/schedule/schedule')

router.get('/:id', async(req, res) => {
    const schedules = await scheduleMod.find().sort({ createdAt: -1 })
    res.render('doctor/schedules/schedules', { msg: '', id: req.params.id, schedules })
})

router.post('/:id', async(req, res, next) => {
    const schedules = await scheduleMod.find()
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
    try{
        if (start != null && end != null) {
            const sameStart = await scheduleMod.findOne({ doctor: id, start: start })
            const sameEnd = await scheduleMod.findOne({ doctor: id, end: end })
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
                                    scheduleMod.findOneAndUpdate({ doctor: id }, { active: true }, (err, docs) => {
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
            res.render('doctor/schedules/schedules', { msg: 'Fill all the Fields', id, schedules })
        }
    } catch (err) {
        console.log(err)
        res.render('doctor/schedules/schedules', { msg: `${err.message}` , id, schedules })
    }
})

module.exports = router