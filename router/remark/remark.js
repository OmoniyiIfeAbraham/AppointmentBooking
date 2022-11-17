const express = require('express')
const router = express.Router()

const patients = require('./../../models/patient/profile/profile')
const doctors = require('./../../models/doctor/profile/profile')
const remarkMod = require('./../../models/remarks/remarks')

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

            }
        } catch (err) {
            console.log(err)
            next(err)
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

            }
        } catch (err) {
            console.log(err)
            next(err)
        }
    } else {
        res.redirect('/doctorLogin')
    }

})

module.exports = router