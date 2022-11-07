const express = require('express')
const router = express.Router()

const profileMod = require('./../../../models/patient/profile/profile')

router.get('/:id', async(req, res) => {
    const id = req.params.id
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'admin') {
        const info = await profileMod.findById({ _id: id })
        // console.log(info)
        res.render("admin/patients/viewPatient", { info })
    } else {
        res.redirect('/adminLogin')
    }
})

module.exports = router