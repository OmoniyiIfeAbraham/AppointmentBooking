const express = require('express')
const router = express.Router()

const profileMod = require('./../../../models/patient/profile/profile')

router.get('/', async(req, res) => {
    const sess = req.session
    if ( sess.email && sess.password && sess.identifier === 'doctor') {
        const patients = await profileMod.find()
        console.log(patients)
        res.render('doctor/patients/patients', { patients, msg: '' })
    } else {
        res.redirect('/doctorLogin')
    }
})

module.exports = router