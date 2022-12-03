const express = require('express')
const router = express.Router()

const registerMod = require('./../../../models/doctor/auth/register')
const profileMod = require('./../../../models/doctor/profile/profile')
const patientMod = require('./../../../models/patient/profile/profile')
const scheduleMod = require('./../../../models/doctor/schedule/schedule')

router.get('/', async(req, res) => {
    const sess = req.session
    console.log(sess)
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        try {
            const profile = await registerMod.findOne({ email: sess.email })
            const you = await profileMod.findOne({ email: sess.email })
            console.log(profile._id)
            const person = await profileMod.findOne({ uniqueID: profile._id })
            if (profile.completeProfile == false) {
                const id = profile._id
                res.render('doctor/profile/completeProfile', { id, check: false, msg: '' })
            } else if (you.permitApprove == true && you.identityApprove == true) {
                const patients = await patientMod.find()
                const schedules = await scheduleMod.find({ doctor: you._id })
                console.log(schedules)
                res.render('doctor/profile/profile', { id: person._id, unique: profile._id, you, patients, schedules })
            } else {
                res.render('doctor/profile/waiting')
            }
        } catch (err) {
            console.log(err)
            res.render('doctor/auth/login', { msg: 'An Error Occured!!!'})
        }
    } else {
        res.redirect('/doctorLogin')
    }
})

module.exports = router