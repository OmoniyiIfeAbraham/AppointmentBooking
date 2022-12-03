const express = require('express')
const router = express.Router()

const registerMod = require('./../../../models/patient/auth/register')
const profileMod = require('./../../../models/patient/profile/profile')

router.post('/:id', async(req, res, next) => {
    const id = req.params.id
    const DOB = req.body.dob
    const Address = req.body.address
    const StateOfOrigin = req.body.stateOfOrigin
    const MaritalStatus = req.body.maritalStatus
    try {
        if (DOB != null && Address != null && StateOfOrigin != null && MaritalStatus != null) {
            const person = await registerMod.findOne({ _id: id })
            const profile = new profileMod({
                firstname: person.firstname,
                lastname: person.lastname,
                gender: person.gender,
                title: person.title,
                email: person.email,
                profilePicture: person.profilePicture,
                password: person.password,
                profilePublicID: person.profilePublicID,
                uniqueID: person._id,
                dob: DOB,
                address: Address,
                stateOfOrigin: StateOfOrigin,
                maritalStatus: MaritalStatus
            })
            const verify = await profileMod.findOne({ uniqueID: person._id })
            if (verify) {
                res.render('patient/profile/completeProfile', { msg: 'Profile Already Updated', id: req.params.id })
            } else {
                await profile.save()
                registerMod.findOneAndUpdate({ _id: id }, { completeProfile: true }, (err, docs) => {
                    if (err) {
                        console.log(err)
                        next(err)
                    } else {
                        res.redirect('/patient')
                    }
                })
            }
        } else {
            res.render('patient/profile/completeProfile', { msg: 'Please fill all the fields', id: req.params.id })
        }
    } catch (err) {
        console.log(err)
        res.render('patient/profile/completeProfile', { msg: 'An Error Occured!!!', id: req.params.id })
    }
})

module.exports = router