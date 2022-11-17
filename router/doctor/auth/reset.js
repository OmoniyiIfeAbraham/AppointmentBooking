const express = require('express')
const router = express.Router()

const resetMod = require('./../../../models/doctor/auth/reset')

router.get('/', (req, res) => {
    res.render('doctor/auth/reset', { msg: '' })
})

module.exports = router