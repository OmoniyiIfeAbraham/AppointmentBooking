const express = require('express')
const router = express.Router()

const scheduleMod = require('./../../../models/doctor/schedule/schedule')
const bookingMod = require('./../../../models/patient/bookings/bookings')

router.get('/:bam/:id', async(req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        console.log(req.params.id)
        const id = req.params.id
        console.log(req.params.bam)
        const bam = req.params.bam
        try {
            const Schedule = await scheduleMod.findById({ _id : id })
            console.log(Schedule)
            bookingMod.findOneAndDelete({ scheduleID: id }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                } else {
                    scheduleMod.findByIdAndDelete({ _id : id }, (err, docs) => {
                        if (err) {
                            console.log(err)
                            next(err)
                        } else {
                            res.redirect(`/schedules/${bam}`)
                        }
                    })
                }
            })
        } catch(err) {
            console.log(err)
            res.render('doctor/schedules/schedules', { msg: `${err.message}` , bam, schedules })
        }
    } else {
        res.redirect('/doctorLogin')
    }
})

module.exports = router