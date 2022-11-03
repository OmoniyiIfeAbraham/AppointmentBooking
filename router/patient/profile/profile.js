const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'patient') {
        res.render('patient/profile/profile')
    } else {
        res.redirect('/patientLogin')
    }
})

module.exports = router