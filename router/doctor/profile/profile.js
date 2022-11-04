const express = require('express')
const router = express.Router()

const registerMod = require('./../../../models/doctor/auth/register')

router.get('/', async(req, res) => {
    const sess = req.session
    console.log(sess)
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        try {
            const profile = await registerMod.findOne({ email: sess.email })
            console.log(profile)
            if (profile.completeProfile == false) {
                const id = profile._id
                res.render('doctor/profile/completeProfile', { id, check: false, msg: '' })
            } else {
                res.render('doctor/profile/profile')
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