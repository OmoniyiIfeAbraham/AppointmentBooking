const express = require('express')
const router = express.Router()

const registerMod = require('./../../../models/patient/auth/register')

router.get('/', async(req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'patient') {
        try {
            const profile = await registerMod.findOne({ email: sess.email })
            console.log(profile)
            if (profile.completeProfile == false) {
                const id = profile._id
                console.log(id)
                res.render('patient/profile/completeProfile', { id, msg: '' })
            } else {
                res.render('patient/profile/profile')
            }
        } catch(err) {
            console.log(err)
            res.render('patient/auth/login', { msg: `${err.message}`})
        }
        res.render('patient/profile/profile')
    } else {
        res.redirect('/patientLogin')
    }
})

module.exports = router