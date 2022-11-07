const express = require('express')
const router = express.Router()

const cloudinary = require('cloudinary')

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
                                    res.redirect('/patients')
                                }
                            })
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err)
            res.render('admin/patients/patients', { msg: `${err.message}` })
        }
    } else {
        res.redirect('/adminLogin')
    }
})

module.exports = router