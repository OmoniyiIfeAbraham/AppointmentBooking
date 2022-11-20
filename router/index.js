const express = require('express')

const router = express.Router()

const profileMod = require('./../models/doctor/profile/profile')
const patientProfileMod = require('./../models/patient/profile/profile')

router.get('/', (req, res) => {
    res.redirect('/home')
})

router.get('/home', async (req, res) => {
    const sess = req.session
    const doctors = await profileMod.find()
    const patients = await patientProfileMod.find()
    if (sess.identifier === 'admin') {
        res.redirect('/admin')
    } else if (sess.identifier === 'doctor') {
        res.redirect('/doctor')
    } else if (sess.identifier === 'patient') {
        res.redirect('/patient')
    } else {
        res.render('index', { doctors, patients })
    }
})

router.get('/about', async (req, res) => {
    const sess = req.session
    const doctors = await profileMod.find()
    const patients = await patientProfileMod.find()
    if (sess.identifier === 'admin') {
        res.redirect('/admin')
    } else if (sess.identifier === 'doctor') {
        res.redirect('/doctor')
    } else if (sess.identifier === 'patient') {
        res.redirect('/patient')
    } else {
        res.render('front/about', { doctors, patients })
    }
})

router.get('/service', async (req, res) => {
    const sess = req.session
    const doctors = await profileMod.find()
    const patients = await patientProfileMod.find()
    if (sess.identifier === 'admin') {
        res.redirect('/admin')
    } else if (sess.identifier === 'doctor') {
        res.redirect('/doctor')
    } else if (sess.identifier === 'patient') {
        res.redirect('/patient')
    } else {
        res.render('front/service', { doctors, patients })
    }
})

router.get('/price', async (req, res) => {
    const sess = req.session
    const doctors = await profileMod.find()
    const patients = await patientProfileMod.find()
    if (sess.identifier === 'admin') {
        res.redirect('/admin')
    } else if (sess.identifier === 'doctor') {
        res.redirect('/doctor')
    } else if (sess.identifier === 'patient') {
        res.redirect('/patient')
    } else {
        res.render('front/pricing', { doctors, patients })
    }
})

router.get('/contact', async (req, res) => {
    const sess = req.session
    const doctors = await profileMod.find()
    const patients = await patientProfileMod.find()
    if (sess.identifier === 'admin') {
        res.redirect('/admin')
    } else if (sess.identifier === 'doctor') {
        res.redirect('/doctor')
    } else if (sess.identifier === 'patient') {
        res.redirect('/patient')
    } else {
        res.render('front/contact', { doctors, patients })
    }
})

module.exports = router