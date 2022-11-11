const express = require('express')
const router = express.Router()

const scheduleMod = require('./../../../models/doctor/schedule/schedule')

router.get('/:id', async(req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        const id = req.params.id
        const schedule = await scheduleMod.findById({ _id: id })
        res.render('doctor/schedules/viewSchedule', { schedule })
    } else {
        res.redirect('/doctorLogin')
    }
})

module.exports = router