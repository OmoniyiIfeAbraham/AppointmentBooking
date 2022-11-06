const express = require('express')
const router = express.Router()

const profileMod = require('./../../../models/patient/profile/profile')

router.get('/', async(req, res) => {
    const patients = await profileMod.find()
    console.log(patients)
    res.render('admin/patients/patients')
})

module.exports = router