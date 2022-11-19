const express = require('express')
const router = express.Router()

const registerMod = require('./../../../models/doctor/auth/register')
const profileMod = require('./../../../models/doctor/profile/profile')

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
                res.render('doctor/profile/profile', { id: person._id, unique: profile._id })
            } else {
                res.render('doctor/profile/waiting')
            }
        } catch (err) {
            console.log(err)
            res.render('doctor/auth/login', { msg: `${err.message}`})
        }
    } else {
        res.redirect('/doctorLogin')
    }
})

module.exports = router