const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.redirect('/home')
})

router.get('/home', (req, res) => {
    const sess = req.session
    if (sess.identifier === 'admin') {
        res.redirect('/admin')
    } else if (sess.identifier === 'doctor') {
        res.redirect('/doctor')
    } else if (sess.identifier === 'patient') {
        res.redirect('/patient')
    } else {
        res.render('index')
    }
})

module.exports = router