const express = require('express')
const router = express.Router()

const profileMod = require('./../../../models/patient/profile/profile')

router.get('/', async(req, res) => {
    const sess = req.session
    if ( sess.email && sess.password && sess.identifier === 'admin') {
        const patients = await profileMod.find()
        console.log(patients)
        res.render('admin/patients/patients', { patients, msg: '' })
    } else {
        res.redirect('/adminLogin')
    }
})

module.exports = router