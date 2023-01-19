const express = require('express')
const router = express.Router()

const cloudinary = require('cloudinary')

const mailer = require('nodemailer')

const systemMail = mailer.createTransport({
    service: process.env.service,
    host: process.env.host,
    port: 465,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    },
    tls: {
        rejectUnauthorized: false
    }
})

const profileMod = require('./../../../models/patient/profile/profile')
const authMod = require('./../../../models/patient/auth/auth')
const registerMod = require('./../../../models/patient/auth/register')

router.get('/:id', async(req, res, next) => {
    const id = req.params.id
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'admin') {
        try {
            const person = await profileMod.findById({ _id: id })
            console.log(person)
            const auth = await authMod.findOne({ uniqueID: person.uniqueID })
            console.log(auth)
            const register = await registerMod.findOne({ _id: person.uniqueID })
            console.log(register)
            const registerPublicID = register.profilePublicID
            authMod.findOneAndDelete({ uniqueID: person.uniqueID }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                } else {
                    registerMod.findByIdAndDelete({ _id: person.uniqueID }, (err, docs) => {
                        if (err) {
                            console.log(err)
                            next(err)
                        } else {
                            cloudinary.v2.uploader.destroy(registerPublicID).then(result => {
                                console.log(result)
                            })
                            profileMod.findByIdAndDelete({ _id: id }, (err, docs) => {
                                if (err) {
                                    console.log(err)
                                    next(err)
                                } else {
                                    async function mail() {
                                        const mailOption={
                                            from: `${process.env.adminName} ${process.env.email}`,
                                            to: person.email,
                                            subject: `${person.firstname} ${person.lastname} ACCOUNT`,
                                            html: `
                                                <body>
                                                    <center><h3>Hello ${person.firstname} ${person.lastname}</h3></center>
                                                    <center><h5>Your Account has been Deleted</h5></center>
                                                </body>
                                            `
                                        }
                                        await systemMail.sendMail(mailOption)
                                    }
                                    mail()
                                    res.redirect('/patients')
                                }
                            })
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err)
            res.render('admin/patients/patients', { msg: 'An Error Occured!!!' })
        }
    } else {
        res.redirect('/adminLogin')
    }
})

module.exports = router