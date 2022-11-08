const express = require('express')
const router = express.Router()

const profileMod = require('./../../../models/patient/profile/profile')

router.get('/:id', async(req, res) => {
    const id = req.params.id
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        const info = await profileMod.findById({ _id: id })
        // console.log(info)
        res.render("doctor/patients/viewPatient", { info })
    } else {
        res.redirect('/doctorLogin')
    }
})

module.exports = router