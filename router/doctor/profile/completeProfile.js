const express = require('express')
const router = express.Router()

const cloudinary = require('cloudinary')

const registerMod = require('./../../../models/doctor/auth/register')
const profileMod = require('./../../../models/doctor/profile/profile')

router.post('/:id', async(req, res) => {
    // console.log(req.params.id)
    const id = req.params.id
    const DOB = req.body.dob
    const Address = req.body.address
    const StateOfOrigin = req.body.stateOfOrigin
    const MaritalStatus = req.body.maritalStatus
    try {
        if (DOB != null && Address != null && StateOfOrigin != null && MaritalStatus != null) {
            const Permit = req.files.permit
            if (Permit.mimetype=='image/apng' || Permit.mimetype=='image/avif' ||Permit.mimetype=='image/gif' || Permit.mimetype=='image/jpeg' || Permit.mimetype=='image/png' || Permit.mimetype=='image/svg+xml' || Permit.mimetype=='image/webp' || Permit.mimetype=='application/pdf' || Permit.mimetype=='application/x-pdf' || Permit.mimetype=='application/x-bzpdf' || Permit.mimetype=='application/x-gzpdf' || Permit.mimetype=='applications/vnd.pdf' || Permit.mimetype=='application/acrobat' || Permit.mimetype=='application/x-google-chrome-pdf' || Permit.mimetype=='text/pdf' || Permit.mimetype=='text/x-pdf' || Permit.mimetype=='application/msword' || Permit.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || Permit.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.template' || Permit.mimetype=='application/vnd.ms-word.document.macroEnabled.12' || Permit.mimetype=='application/vnd.ms-word.template.macroEnabled.12') {
                const upload = await cloudinary.v2.uploader.upload(Permit.tempFilePath, { resource_type: 'auto', folder: process.env.doctorWorkPermitFolder, use_filename: false, unique_filename: true })
                const person = await registerMod.findOne({ _id: id})
                const profile = new profileMod({
                    firstname: person.firstname,
                    lastname: person.lastname,
                    gender: person.gender,
                    email: person.email,
                    profilePicture: person.profilePicture,
                    password: person.password,
                    profilePublicID: person.profilePublicID,
                    uniqueID: person._id,
                    dob: DOB,
                    address: Address,
                    stateOfOrigin: StateOfOrigin,
                    maritalStatus: MaritalStatus,
                    permit: upload.secure_url,
                    permitPublicID: upload.public_id
                })
                const verify = await profileMod.findOne({ uniqueID: person._id})
                if (verify) {
                    cloudinary.v2.uploader.destroy(upload.public_id).then(result => {
                        console.log(result)
                    })
                    res.render('doctor/profile/completeProfile', { msg: 'First profile already submitted', check: true, id: req.params.id })
                } else {
                    await profile.save()
                    res.render('doctor/profile/completeProfile', { msg: '', check: true, id: person._id })
                }
            } else {
                res.render('doctor/profile/completeProfile', { msg: 'Invalid File Type', check: false, id: req.params.id })
            }
        } else {
            res.render('doctor/profile/completeProfile', { msg: 'Please fill all the fields!', check: false, id: req.params.id })
        }
    } catch(err) {
        console.log(err)
        res.render('doctor/profile/completeProfile', { msg: 'An Error Occured!!!', check: false, id: req.params.id })
    }
})

router.post('/:id/identity', async(req, res, next) => {
    // console.log(req.params.id)
    const id = req.params.id
    try {
        const Identity = req.files.identity
        if (Identity.mimetype=='image/apng' || Identity.mimetype=='image/avif' ||Identity.mimetype=='image/gif' || Identity.mimetype=='image/jpeg' || Identity.mimetype=='image/png' || Identity.mimetype=='image/svg+xml' || Identity.mimetype=='image/webp' || Identity.mimetype=='application/pdf' || Identity.mimetype=='application/x-pdf' || Identity.mimetype=='application/x-bzpdf' || Identity.mimetype=='application/x-gzpdf' || Identity.mimetype=='applications/vnd.pdf' || Identity.mimetype=='application/acrobat' || Identity.mimetype=='application/x-google-chrome-pdf' || Identity.mimetype=='text/pdf' || Identity.mimetype=='text/x-pdf' || Identity.mimetype=='application/msword' || Identity.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || Identity.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.template' || Identity.mimetype=='application/vnd.ms-word.document.macroEnabled.12' || Identity.mimetype=='application/vnd.ms-word.template.macroEnabled.12') {
            const verify = await profileMod.findOne({ uniqueID: id })
            if (verify.identity === ' ' && verify.identityPublicID === ' ') {
                const upload = await cloudinary.v2.uploader.upload(Identity.tempFilePath, { resource_type: 'auto', folder: process.env.doctorIdentityFolder, use_filename: false, unique_filename: true })
                profileMod.findOneAndUpdate({ uniqueID: id}, { identity: upload.secure_url, identityPublicID: upload.public_id }, (err, docs) => {
                    if (err) {
                        console.log(err)
                        next(err)
                    } else {
                        registerMod.findOneAndUpdate({ _id: id }, { completeProfile: true }, (err, docs) => {
                            if (err) {
                                console.log(err)
                                next(err)
                            } else {
                                res.redirect('/doctor')
                            }
                        })
                    }
                })
            } else {
                res.redirect('/doctor')
            }
        } else {
            res.render('doctor/profile/completeProfile', { msg: 'Invalid File Type', check: true, id: req.params.id })
        }
    } catch(err) {
        console.log(err)
        res.render('doctor/profile/completeProfile', { msg: 'An Error Occured!!!', check: true, id: req.params.id })
    }
})

module.exports = router