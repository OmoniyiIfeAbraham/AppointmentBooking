const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const registerMod = require('./../../../models/doctor/auth/register')

router.get('/', (req, res) => {
    res.render('doctor/auth/login', { msg: '' })
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
                        sess.identifier = 'doctor'
                        console.log(sess)
                        res.redirect('/doctor')
                    } else {
                        sess.email = loginEmail
                        sess.password = loginPassword
                        res.redirect('/doctorRegister/otp')
                    }
                } else {
                    res.render('doctor/auth/login', { msg: 'Incorrect Password' })
                }
            } else {
                res.render('doctor/auth/login', { msg: 'Incorrect Email' })
            }
        } else {
            res.render('doctor/auth/login', { msg: 'Password must be 6 or more characters' })
        }
    } catch (err) {
        console.log(err)
        res.render('doctor/auth/login', { msg: 'An Error Occured!!!'})
    }
})

module.exports = router