const express = require('express')
const router = express.Router()

const profileMod = require('./../../../models/patient/profile/profile')
const registerMod = require('./../../../models/doctor/auth/register')
const doctorMod = require('./../../../models/doctor/profile/profile')

router.get('/', async(req, res) => {
    const sess = req.session
    if ( sess.email && sess.password && sess.identifier === 'doctor') {
        const patients = await profileMod.find()
        const profile = await registerMod.findOne({ email: sess.email })
        const person = await doctorMod.findOne({ uniqueID: profile._id })
        const you = await doctorMod.findOne({ email: sess.email })
        console.log(patients)
        res.render('doctor/patients/patients', { patients, msg: '', unique: profile._id, you, id: person._id })
    } else {
        res.redirect('/doctorLogin')
    }
})

module.exports = router