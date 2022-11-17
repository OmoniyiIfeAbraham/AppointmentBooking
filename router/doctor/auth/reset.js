const express = require('express')
const router = express.Router()

const resetMod = require('./../../../models/doctor/auth/reset')
const resetAuthMod = require('./../../../models/doctor/auth/resetAuth')
const profileMod = require('./../../../models/doctor/profile/profile')
const registerMod = require('./../../../models/doctor/auth/register')

const bcrypt = require('bcrypt')
const token = require('@supercharge/strings')
const mailer = require('nodemailer')

const systemMail = mailer.createTransport({
    service: process.env.service,
    host: process.env.host,
    port: 465,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
})

router.get('/', (req, res) => {
    res.render('doctor/auth/reset', { msg: '' })
})

router.post('/', async(req, res) => {
    const sess = req.session
    // console.log(req.body)
    const Email = req.body.email
    const Password = req.body.password
    try {
        if (Email != null && Password != null) {
            if (Password.length >= 6) {
                const verifyMail = await profileMod.findOne({ email: Email })
                if (verifyMail) {
                    const person = new resetMod({
                        email: Email,
                        password: bcrypt.hashSync(Password, 10)
                    })
                    const savePerson = await person.save()
                    const random = token.random(4)
                    console.log(random)
                    const auth = new resetAuthMod({
                        uniqueID: savePerson._id,
                        email: savePerson.email,
                        otp: random
                    })
                    await auth .save()
                    sess.email = req.body.email
                    sess.password = req.body.password
                    const mailOption={
                        from: `${process.env.adminName} ${process.env.email}`,
                        to: Email,
                        subject: `${verifyMail.firstname} ${verifyMail.lastname} RESET OTP`,
                        html: `
                            <body>
                                <center><h3>Hello ${verifyMail.firstname} ${verifyMail.lastname} your RESET OTP is...</h3></center>
                                <center><h1>${random}</h1></center>
                            </body>
                        `
                    }
                    await systemMail.sendMail(mailOption)
                    res.redirect('/resetPassword/otp')
                } else {
                    res.render('doctor/auth/reset', { msg: 'There is no registered User with this Email Address' })
                }
            } else {
                res.render('doctor/auth/reset', { msg: 'Password must be 6 characters or more' })
            }
        } else {
            res.render('doctor/auth/reset', { msg: 'Please fill all the fields' })
        }
    } catch (err) {
        console.log(err)
        res.render('doctor/auth/reset', { msg: `${err.message}` })
    }
})

router.get('/otp', (req, res) => {
    const sess = req.session
    console.log(sess)
    if (sess.email && sess.password) {
        res.render('doctor/auth/resetOtp', { msg: '' })
    } else {
        res.redirect('home')
    }
})

router.post('/otp', async(req, res, next) => {
    const sess = req.session
    console.log(sess)
    const OTP = req.body.otp
    if (sess.email && sess.password) {
        try {
            const personAuth = await resetMod.findOne({ email: sess.email })
            if (personAuth) {
                if (OTP != null) {
                    const check = await resetAuthMod.findOne({ email: sess.email })
                    if (OTP != check.otp) {
                        res.render('doctor/auth/resetOtp', { msg: 'Incorrect OTP' })
                    } else {
                        resetAuthMod.findOneAndUpdate({ email: sess.email }, { verified: true }, (err, docs) => {
                            if (err) {
                                console.log(err)
                                next(err)
                            } else {
                                resetMod.findOneAndUpdate({ email: sess.email }, { verified: true }, (err, docs) => {
                                    if (err) {
                                        console.log(err)
                                        next(err)
                                    } else {
                                        async function cont() {
                                            const person = await resetMod.findOne({ email: sess.email })
                                            profileMod.findOneAndUpdate({ email: sess.email }, { password: person.password }, (err, docs) => {
                                                if (err) {
                                                    console.log(err)
                                                    next(err)
                                                } else {
                                                    registerMod.findOneAndUpdate({ email: sess.email }, { password: person.password }, (err, docs) => {
                                                        if (err) {
                                                            console.log(err)
                                                            next(err)
                                                        } else {
                                                            res.redirect('/doctorLogin')
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        cont()
                                    }
                                })
                            }
                        })
                    }
                } else {
                    res.render('doctor/auth/resetOtp', { msg: 'OTP cannot be Empty' })
                }
            } else {
                sess.destroy()
                res.redirect('/home')
            }
        } catch (err) {
            console.log(err)
            res.render('doctor/auth/resetOtp', { msg: `${err.message}`})
        }
    } else {
        res.redirect('/home')
    }
})

module.exports = router