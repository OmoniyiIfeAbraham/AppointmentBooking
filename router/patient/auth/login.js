const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const registerMod = require('./../../../models/patient/auth/register')

router.get('/', (req, res) => {
    res.render('patient/auth/login', { msg: '' })
})

router.post('/', async(req, res) => {
    const sess = req.session
    const loginEmail = req.body.email
    const loginPassword = req.body.password
    console.log(loginEmail)
    console.log(loginPassword)
    try {
        if (loginPassword.length >= 6) {
            const check = await registerMod.findOne({ email: loginEmail })
            if (check) {
                const comparePass = bcrypt.compareSync(loginPassword, check.password)
                if (comparePass == true) {
                    if (check.verified == true) {
                        sess.email = loginEmail,
                        sess.password = loginPassword,
                        sess.identifier = 'patient'
                        console.log(sess)
                        res.redirect('/patient')
                    } else {
                        res.redirect('/patientRegister/otp')
                    }
                } else {
                    res.render('patient/auth/login', { msg: 'Incorrect Password' })
                }
            } else {
                res.render('patient/auth/login', { msg: 'Incorrect Email' })
            }
        } else {
            res.render('patient/auth/login', { msg: 'Password must be 6 or more characters'})
        }
    } catch(err) {
        console.log(err)
        res.render('patient/auth/login', { msg: `${err.message}`})
    }
})

module.exports = router