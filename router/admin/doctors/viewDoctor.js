const express = require('express')
const router = express.Router()

const profileMod = require('./../../../models/doctor/profile/profile')

router.get('/:id', async(req, res) => {
    const id = req.params.id
    const sess = req.session
    // if (sess.email && sess.password && sess.identifier === 'admin') {
        const info = await profileMod.findById({ _id: id })
        res.render('admin/doctors/viewDoctor', { info, msg: '' })
    // } else {
    //     res.redirect('/adminLogin')
    // }
})

module.exports = router