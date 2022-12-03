const express = require('express')
const router = express.Router()

const profileMod = require('./../../../models/doctor/profile/profile')
const registerMod = require('./../../../models/doctor/auth/register')

const cloudinary = require('cloudinary')

router.get('/:unique', async (req, res) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        const doctor = await profileMod.findOne({ uniqueID: req.params.unique })
        res.render('doctor/profile/view', { doctor, msg: '' })
    } else {
        res.redirect('/doctorLogin')
    }
})

router.post('/info/:uniqueID', async (req, res, next) => {
    const sess = req.session
    if (sess.email && sess.password && sess.identifier === 'doctor') {
        console.log(req.body)
        console.log(req.params.uniqueID)
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const gender = req.body.gender
        const email = req.body.email
        const dob = req.body.dob
        const address = req.body.address
        const stateOfOrigin = req.body.stateOfOrigin
        const maritalStatus = req.body.maritalStatus
        const doctor = await profileMod.findOne({ uniqueID: req.params.uniqueID })
        try {
            if (firstname != null && lastname != null && gender != null && email != null && dob != null && address != null && stateOfOrigin != null && maritalStatus != null) {
                registerMod.findByIdAndUpdate({ _id: req.params.uniqueID }, { firstname: firstname, lastname: lastname, gender: gender, email: email }, (err, docs) => {
                    if (err) {
                        console.log(err)
                        next(err)
                    } else {
                        profileMod.findOneAndUpdate({ uniqueID: req.params.uniqueID }, { firstname: firstname, lastname: lastname, gender: gender, email: email, dob: dob, address: address, stateOfOrigin: stateOfOrigin, maritalStatus: maritalStatus }, (err, docs) => {
                            if (err) {
                                console.log(err)
                                next(err)
                            } else {
                                // res.render('doctor/profile/view', { doctor, msg: 'Your Profile has been Updated Successfully' })
                                res.redirect(`/view/${req.params.uniqueID}`)
                            }
                        })
                    }
                })
            } else {
                res.render('doctor/profile/view', { doctor, msg: 'All Fields have to be Filled' })
            }
        } catch (err) {
            console.log(err)
            res.render('doctor/profile/view', { doctor, msg: 'An Error Occured!!!' })
        }
    } else {
        res.redirect('/doctorLogin')
    }
})

router.post('/profilePic/:uniqueID', async (req, res, next) => {
const sess = req.session
if (sess.email && sess.password && sess.identifier === 'doctor') {
    console.log(req.params.uniqueID)
    const doctor = await profileMod.findOne({ uniqueID: req.params.uniqueID })
    try {
        const profile = req.files.profilePicture
        if (profile.mimetype=='image/apng' || profile.mimetype=='image/avif' ||profile.mimetype=='image/gif' || profile.mimetype=='image/jpeg' || profile.mimetype=='image/png' || profile.mimetype=='image/svg+xml' || profile.mimetype=='image/webp') {
            const upload = await cloudinary.v2.uploader.upload(profile.tempFilePath, { resource_type: 'image', folder: process.env.doctorProfilePictureFolder, use_filename: false, unique_filename: true })
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
                            res.redirect(`/view/${req.params.uniqueID}`)
                        }
                    })
                }
            })
        } else {
            res.render('doctor/profile/view', { doctor, msg: 'Invalid Image File Type' })
        }
    } catch (err) {
        console.log(err)
        res.render('doctor/profile/view', { doctor, msg: 'An Error Occured!!!' })
    }
    } else {
        res.redirect('/doctorLogin')
    }
})

router.post('/permit/:uniqueID', async (req, res, next) => {
const sess = req.session
if (sess.email && sess.password && sess.identifier === 'doctor') {
    console.log(req.params.uniqueID)
    const doctor = await profileMod.findOne({ uniqueID: req.params.uniqueID })
    try {
        const Permit = req.files.permit
        if (Permit.mimetype=='image/apng' || Permit.mimetype=='image/avif' ||Permit.mimetype=='image/gif' || Permit.mimetype=='image/jpeg' || Permit.mimetype=='image/png' || Permit.mimetype=='image/svg+xml' || Permit.mimetype=='image/webp' || Permit.mimetype=='application/pdf' || Permit.mimetype=='application/x-pdf' || Permit.mimetype=='application/x-bzpdf' || Permit.mimetype=='application/x-gzpdf' || Permit.mimetype=='applications/vnd.pdf' || Permit.mimetype=='application/acrobat' || Permit.mimetype=='application/x-google-chrome-pdf' || Permit.mimetype=='text/pdf' || Permit.mimetype=='text/x-pdf' || Permit.mimetype=='application/msword' || Permit.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || Permit.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.template' || Permit.mimetype=='application/vnd.ms-word.document.macroEnabled.12' || Permit.mimetype=='application/vnd.ms-word.template.macroEnabled.12') {
            const upload = await cloudinary.v2.uploader.upload(Permit.tempFilePath, { resource_type: 'auto', folder: process.env.doctorWorkPermitFolder, use_filename: false, unique_filename: true })
            const individual = await profileMod.findOne({ uniqueID: req.params.uniqueID })
            const PublicID = individual.permitPublicID
            cloudinary.v2.uploader.destroy(PublicID).then(result => {
                console.log(result)
            })
            registerMod.findByIdAndUpdate({ _id: req.params.uniqueID }, { permit: upload.secure_url, permitPublicID: upload.public_id }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                } else {
                    profileMod.findOneAndUpdate({ uniqueID: req.params.uniqueID }, { permit: upload.secure_url, permitPublicID: upload.public_id, permitApprove: false }, (err, docs) => {
                        if (err) {
                            console.log(err)
                            next(err)
                        } else {
                            // res.render('doctor/profile/view', { doctor, msg: 'Your Profile has been Updated Successfully' })
                            res.redirect(`/view/${req.params.uniqueID}`)
                        }
                    })
                }
            })
        } else {
            res.render('doctor/profile/view', { doctor, msg: 'Invalid File Type' })
        }
    } catch (err) {
        console.log(err)
        res.render('doctor/profile/view', { doctor, msg: 'An Error Occured!!!' })
    }
    } else {
        res.redirect('/doctorLogin')
    }
})

router.post('/profilePic/:uniqueID', async (req, res, next) => {
const sess = req.session
if (sess.email && sess.password && sess.identifier === 'doctor') {
    console.log(req.params.uniqueID)
    const doctor = await profileMod.findOne({ uniqueID: req.params.uniqueID })
    try {
        const profile = req.files.profilePicture
        if (profile.mimetype=='image/apng' || profile.mimetype=='image/avif' ||profile.mimetype=='image/gif' || profile.mimetype=='image/jpeg' || profile.mimetype=='image/png' || profile.mimetype=='image/svg+xml' || profile.mimetype=='image/webp') {
            const upload = await cloudinary.v2.uploader.upload(profile.tempFilePath, { resource_type: 'image', folder: process.env.doctorProfilePictureFolder, use_filename: false, unique_filename: true })
            const individual = await registerMod.findById({ _id: req.params.uniqueID })
            const PublicID = individual.profilePublicID
            cloudinary.v2.uploader.destroy(PublicID).then(result => {
                console.log(result)
            })
            profileMod.findOneAndUpdate({ uniqueID: req.params.uniqueID }, { profilePicture: upload.secure_url, profilePublicID: upload.public_id }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                } else {
                    // res.render('doctor/profile/view', { doctor, msg: 'Your Profile has been Updated Successfully' })
                    res.redirect(`/view/${req.params.uniqueID}`)
                }
            })
        } else {
            res.render('doctor/profile/view', { doctor, msg: 'Invalid Image File Type' })
        }
    } catch (err) {
        console.log(err)
        res.render('doctor/profile/view', { doctor, msg: 'An Error Occured!!!' })
    }
    } else {
        res.redirect('/doctorLogin')
    }
})

router.post('/identity/:uniqueID', async (req, res, next) => {
const sess = req.session
if (sess.email && sess.password && sess.identifier === 'doctor') {
    console.log(req.params.uniqueID)
    const doctor = await profileMod.findOne({ uniqueID: req.params.uniqueID })
    try {
        const Identity = req.files.identity
        if (Identity.mimetype=='image/apng' || Identity.mimetype=='image/avif' ||Identity.mimetype=='image/gif' || Identity.mimetype=='image/jpeg' || Identity.mimetype=='image/png' || Identity.mimetype=='image/svg+xml' || Identity.mimetype=='image/webp' || Identity.mimetype=='application/pdf' || Identity.mimetype=='application/x-pdf' || Identity.mimetype=='application/x-bzpdf' || Identity.mimetype=='application/x-gzpdf' || Identity.mimetype=='applications/vnd.pdf' || Identity.mimetype=='application/acrobat' || Identity.mimetype=='application/x-google-chrome-pdf' || Identity.mimetype=='text/pdf' || Identity.mimetype=='text/x-pdf' || Identity.mimetype=='application/msword' || Identity.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || Identity.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.template' || Identity.mimetype=='application/vnd.ms-word.document.macroEnabled.12' || Identity.mimetype=='application/vnd.ms-word.template.macroEnabled.12') {
            const upload = await cloudinary.v2.uploader.upload(Identity.tempFilePath, { resource_type: 'auto', folder: process.env.doctorIdentityFolder, use_filename: false, unique_filename: true })
            const individual = await profileMod.findOne({ uniqueID: req.params.uniqueID })
            const PublicID = individual.identityPublicID
            cloudinary.v2.uploader.destroy(PublicID).then(result => {
                console.log(result)
            })
            profileMod.findOneAndUpdate({ uniqueID: req.params.uniqueID }, { identity: upload.secure_url, identityPublicID: upload.public_id, identityApprove: false }, (err, docs) => {
                if (err) {
                    console.log(err)
                    next(err)
                } else {
                    // res.render('doctor/profile/view', { doctor, msg: 'Your Profile has been Updated Successfully' })
                    res.redirect(`/view/${req.params.uniqueID}`)
                }
            })
        } else {
            res.render('doctor/profile/view', { doctor, msg: 'Invalid File Type' })
        }
    } catch (err) {
        console.log(err)
        res.render('doctor/profile/view', { doctor, msg: 'An Error Occured!!!' })
    }
    } else {
        res.redirect('/doctorLogin')
    }
})

module.exports = router