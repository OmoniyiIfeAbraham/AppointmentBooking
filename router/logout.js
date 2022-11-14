const express = require('express')
const router = express.Router()

router.get('/admin', (req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'admin') {
        sess.destroy()
        res.redirect('/')
    } else {
        res.redirect('/adminLogin')
    }
})

router.get('/doctor', (req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        sess.destroy()
        res.redirect('/')
    } else {
        res.redirect('/doctorLogin')
    }
})

router.get('/patient', (req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'patient') {
        sess.destroy()
        res.redirect('/')
    } else {
        res.redirect('/patientLogin')
    }
})

module.exports = router