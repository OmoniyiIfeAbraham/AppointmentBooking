const express = require('express')
const router = express.Router()

const bookingMod = require('./../../../models/patient/bookings/bookings')

router.post('/:SID/:DID/:PID', async(req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'patient') {
        const SID = req.params.SID
        const DID = req.params.DID
        const PID = req.params.PID
        try {
            const booking = new bookingMod({
                scheduleID: SID,
                doctorID: DID,
                patientID: PID
            })
            await booking.save()
            res.redirect('/patient')
        } catch (err) {
            console.log(err)
            next(err)
        }
    } else {
        res.redirect('/patientLogin')
    }
})

module.exports = router