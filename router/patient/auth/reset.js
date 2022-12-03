const express = require('express')
const router = express.Router()

const resetMod = require('./../../../models/patient/auth/reset')
const resetAuthMod = require('./../../../models/patient/auth/resetAuth')
const profileMod = require('./../../../models/patient/profile/profile')
const registerMod = require('./../../../models/patient/auth/register')

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
    res.render('patient/auth/reset', { msg: '' })
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
                const not = token.random(10)
                if (verifyMail) {
                    const person = new resetMod({
                        email: Email,
                        password: bcrypt.hashSync(Password, 10),
                        uniqueID: not
                    })
                    const savePerson = await person.save()
                    const random = token.random(4)
                    console.log(random)
                    const auth = new resetAuthMod({
                        uniqueID: savePerson._id,
                        email: savePerson.email,
                        otp: random
                    })
                    await auth.save()
                    sess.email = req.body.email
                    sess.password = req.body.password
                    sess.name = savePerson._id
                    sess.find = person.uniqueID
                    // const mailOption={
                    //     from: `${process.env.adminName} ${process.env.email}`,
                    //     to: Email,
                    //     subject: `${verifyMail.firstname} ${verifyMail.lastname} RESET OTP`,
                    //     html: `
                    //         <body>
                    //             <center><h3>Hello ${verifyMail.firstname} ${verifyMail.lastname} your RESET OTP is...</h3></center>
                    //             <center><h1>${random}</h1></center>
                    //         </body>
                    //     `
                    // }
                    // await systemMail.sendMail(mailOption)
                    res.redirect('/reset/otp')
                } else {
                    res.render('patient/auth/reset', { msg: 'There is no registered User with this Email Address' })
                }
            } else {
                res.render('patient/auth/reset', { msg: 'Password must be 6 characters or more' })
            }
        } else {
            res.render('patient/auth/reset', { msg: 'Please fill all the fields' })
        }
    } catch (err) {
        console.log(err)
        res.render('patient/auth/reset', { msg: 'An Error Occured!!!' })
    }
})

router.get('/otp', (req, res) => {
    const sess = req.session
    console.log(sess)
    if (sess.email && sess.password) {
        res.render('patient/auth/resetOtp', { msg: '' })
    } else {
        res.redirect('home')
    }
})

router.post('/otp', async(req, res, next) => {
    const sess = req.session
    console.log(sess)
    const OTP = req.body.otp
    if (sess.email && sess.password && sess.name) {
        try {
            const personAuth = await resetMod.findOne({ email: sess.email, uniqueID: sess.find })
            if (personAuth) {
                if (OTP != null) {
                    const check = await resetAuthMod.findOne({ email: sess.email, uniqueID: sess.name })
                    if (OTP != check.otp) {
                        res.render('patient/auth/resetOtp', { msg: 'Incorrect OTP' })
                    } else {
                        resetAuthMod.findOneAndUpdate({ email: sess.email, uniqueID: sess.name, verified: false }, { verified: true }, (err, docs) => {
                            if (err) {
                                console.log(err)
                                next(err)
                            } else {
                                resetMod.findOneAndUpdate({ email: sess.email, verified: false, uniqueID: sess.find }, { verified: true }, (err, docs) => {
                                    if (err) {
                                        console.log(err)
                                        next(err)
                                    } else {
                                        async function cont() {
                                            const person = await resetMod.findOne({ email: sess.email, uniqueID: sess.find })
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
                                                            res.redirect('/patientLogin')
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
                    res.render('patient/auth/resetOtp', { msg: 'OTP cannot be Empty' })
                }
            } else {
                sess.destroy()
                res.redirect('/home')
            }
        } catch (err) {
            console.log(err)
            res.render('patient/auth/resetOtp', { msg: 'An Error Occured!!!'})
        }
    } else {
        res.redirect('/home')
    }
})

module.exports = router