const express = require('express')
const router = express.Router()

const mailer = require('nodemailer')

const profileMod = require('./../../../models/doctor/profile/profile')

const systemMail = mailer.createTransport({
    service: process.env.service,
    host: process.env.host,
    port: 465,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
})

router.get('/permit/:id', async(req, res, next) => {
    const sess = req.session
    // if (sess.email && sess.password && sess.identifier === 'admin') {
        try {
            const id = req.params.id
            const locate = await profileMod.findById({ _id: id })
            console.log(locate)
            profileMod.findByIdAndUpdate({ _id: id }, { permitApprove: true }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                } else {
                    async function mail() {
                        const mailOption={
                            from: `${process.env.adminName} ${process.env.email}`,
                            to: locate.email,
                            subject: `${locate.firstname} ${locate.lastname} WORK PERMIT`,
                            html: `
                                <body>
                                    <center><h3>Hello ${locate.firstname} ${locate.lastname}</h3></center>
                                    <center><h5>Your Work Permit/Liscence has been Approved</h5></center>
                                </body>
                            `
                        }
                        await systemMail.sendMail(mailOption)
                    }
                    mail()
                    res.redirect('/doctors')
                }
            })
        } catch(err) {
            console.log(err)
            res.render('admin/doctors/viewDoctor', { msg: `${err.message}` })
        }
    // } else {
    //     res.redirect('/adminLogin')
    // }
})

router.get('/identity/:id', async(req, res, next) => {
    const sess = req.session
    // if (sess.email && sess.password && sess.identifier === 'admin') {
        try {
            const id = req.params.id
            const locate = await profileMod.findById({ _id: id })
            console.log(locate)
            profileMod.findByIdAndUpdate({ _id: id }, { identityApprove: true }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                } else {
                    async function mail() {
                        const mailOption={
                            from: `${process.env.adminName} ${process.env.email}`,
                            to: locate.email,
                            subject: `${locate.firstname} ${locate.lastname} IDENTITY`,
                            html: `
                                <body>
                                    <center><h3>Hello ${locate.firstname} ${locate.lastname}</h3></center>
                                    <center><h5>Your Identity has been Confirmed</h5></center>
                                </body>
                            `
                        }
                        await systemMail.sendMail(mailOption)
                    }
                    mail()
                    res.redirect('/doctors')
                }
            })
        } catch(err) {
            console.log(err)
            res.render('admin/doctors/viewDoctor', { msg: `${err.message}` })
        }
    // } else {
    //     res.redirect('/adminLogin')
    // }
})

router.get('/revoke/:id', async(req, res, next) => {
    const sess = req.session
    // if (sess.email && sess.password && sess.identifier === 'admin') {
        try {
            const id = req.params.id
            const locate = await profileMod.findById({ _id: id })
            console.log(locate)
            profileMod.findByIdAndUpdate({ _id: id }, { permitApprove: false, identityApprove: false }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                } else {
                    async function mail() {
                        const mailOption={
                            from: `${process.env.adminName} ${process.env.email}`,
                            to: locate.email,
                            subject: `${locate.firstname} ${locate.lastname} DOCUMENTS REVOKED`,
                            html: `
                                <body>
                                    <center><h3>Hello ${locate.firstname} ${locate.lastname}</h3></center>
                                    <center><h5>Your Work Permit and Identity Documents has been Revoked</h5></center>
                                </body>
                            `
                        }
                        await systemMail.sendMail(mailOption)
                    }
                    mail()
                    res.redirect('/doctors')
                }
            })
        } catch(err) {
            console.log(err)
            res.render('admin/doctors/viewDoctor', { msg: `${err.message}` })
        }
    // } else {
    //     res.redirect('/adminLogin')
    // }
})

router.get('/decline/:id', async(req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'admin') {
        try {

        } catch(err) {
            console.log(err)
            res.render('admin/doctors/viewDoctor', { msg: `${err.message}` })
        }
    } else {
        res.redirect('/adminLogin')
    }
})

module.exports = router