const express = require('express')
const router = express.Router()

const profileMod = require('./../../../models/patient/profile/profile')
const registerMod = require('./../../../models/patient/auth/register')

const cloudinary = require('cloudinary')

router.get('/:uniqueID', async (req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'patient') {
        const patient = await profileMod.findOne({ uniqueID: req.params.uniqueID })
        res.render('patient/profile/viewProfile', { patient, msg: '' })
    } else {
        res.redirect('/patientLogin')
    }
})

router.post('/profilePic/:uniqueID', async (req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'patient') {
        console.log(req.params.uniqueID)
        const patient = await profileMod.findOne({ uniqueID: req.params.uniqueID })
        try {
            const profile = req.files.profilePicture
            if (profile.mimetype=='image/apng' || profile.mimetype=='image/avif' ||profile.mimetype=='image/gif' || profile.mimetype=='image/jpeg' || profile.mimetype=='image/png' || profile.mimetype=='image/svg+xml' || profile.mimetype=='image/webp') {
                const upload = await cloudinary.v2.uploader.upload(profile.tempFilePath, { resource_type: 'image', folder: process.env.patientProfilePictureFolder, use_filename: false, unique_filename: true })
                const individual = await registerMod.findById({ _id: req.params.uniqueID })
                const PublicID = individual.profilePublicID
                cloudinary.v2.uploader.destroy(PublicID).then(result => {
                    console.log(result)
                })
                registerMod.findByIdAndUpdate({ _id: req.params.uniqueID }, { profilePicture: upload.secure_url, profilePublicID: upload.public_id }, (err, docs) => {
                    if (err) {
                        console.log(err)
                        next(err)
                    } else {
                        profileMod.findOneAndUpdate({ uniqueID: req.params.uniqueID }, { profilePicture: upload.secure_url, profilePublicID: upload.public_id }, (err, docs) => {
                            if (err) {
                                console.log(err)
                                next(err)
                            } else {
                                // res.render('doctor/profile/view', { doctor, msg: 'Your Profile has been Updated Successfully' })
                                res.redirect(`/viewProfile/${req.params.uniqueID}`)
                            }
                        })
                    }
                })
            } else {
                res.render('patient/profile/viewProfile', { patient, msg: 'Invalid Image File Type' })
            }
        } catch (err) {
            console.log(err)
            res.render('patient/profile/viewProfile', { patient, msg: `${err.message}` })
        }
    } else {
        res.redirect('/patientLogin')
    }
})

router.post('/info/:uniqueID', async (req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'patient') {
        console.log(req.body)
        console.log(req.params.uniqueID)
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const gender = req.body.gender
        const title = req.body.title
        const email = req.body.email
        const dob = req.body.dob
        const address = req.body.address
        const stateOfOrigin = req.body.stateOfOrigin
        const maritalStatus = req.body.maritalStatus
        const patient = await profileMod.findOne({ uniqueID: req.params.uniqueID })
        try {
            if (firstname != null && lastname != null && gender != null && title != null && email != null && dob != null && address != null && stateOfOrigin != null && maritalStatus != null) {
                registerMod.findByIdAndUpdate({ _id: req.params.uniqueID }, { firstname: firstname, lastname: lastname, gender: gender, title: title, email: email }, (err, docs) => {
                    if (err) {
                        console.log(err)
                        next(err)
                    } else {
                        profileMod.findOneAndUpdate({ uniqueID: req.params.uniqueID }, { firstname: firstname, lastname: lastname, gender: gender, title: title, email: email, dob: dob, address: address, stateOfOrigin: stateOfOrigin, maritalStatus: maritalStatus }, (err, docs) => {
                            if (err) {
                                console.log(err)
                                next(err)
                            } else {
                                // res.render('doctor/profile/view', { doctor, msg: 'Your Profile has been Updated Successfully' })
                                res.redirect(`/viewProfile/${req.params.uniqueID}`)
                            }
                        })
                    }
                })
            } else {
                res.render('patient/profile/viewProfile', { patient, msg: 'All Fields have to be Filled' })
            }
        } catch (err) {
            console.log(err)
            res.render('patient/profile/viewProfile', { patient, msg: `${err.message}` })
        }
    } else {
        res.redirect('/patientLogin')
    }
})

module.exports = router