const express = require('express')
const app = express()

// dotenv
require('dotenv').config()

const PORT = process.env.PORT

// body parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// cloudinary
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

// morgan
app.use(require('morgan')('dev'))

// express-session
app.use(require('express-session')({ 
    secret: process.env.secret,
    resave: true, 
    saveUninitialized: true, 
    cookie: { expires: 568036800}
}))

// express-fileupload
app.use(require('express-fileupload')({ useTempFiles: true }))

// mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.mongo_link, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(res => {
    if (res) {
        console.log('Database Connected')
        app.listen(PORT, () => console.log(`Running on PORT: ${PORT}`))
    } else {
        console.log('Database not connected')
    }
})

// templating
app.set('view engine', 'ejs')
app.use(express.static('public'))


// ROUTES
// GENERAL
app.use('/', require('./router/index'))

// ADMIN
app.use('/admin', require('./router/admin/home')) // admin home
app.use('/adminLogin', require('./router/admin/adminLogin')) // admin login
app.use('/patients', require('./router/admin/patients/patients')) // view patients
app.use('/viewPatient', require('./router/admin/patients/viewPatient')) // view patient
app.use('/deletePatient', require('./router/admin/patients/deletePatient')) // delete patient
app.use('/doctors', require('./router/admin/doctors/doctors')) // view doctors
app.use('/viewDoctor', require('./router/admin/doctors/viewDoctor')) // view doctor
app.use('/approve', require('./router/admin/doctors/approve')) // approve identities

// DOCTOR        res.render('doctor/auth/login', { msg: `${err.message}`})
app.use('/doctor', require('./router/doctor/profile/profile')) // doctor profile
app.use('/doctorRegister', require('./router/doctor/auth/register')) // doctor register
app.use('/doctorLogin', require('./router/doctor/auth/login')) // doctor login
app.use('/completeProfile', require('./router/doctor/profile/completeProfile')) // complete profile

// PATIENT
app.use('/patient', require('./router/patient/profile/profile')) // patient profile
app.use('/patientLogin', require('./router/patient/auth/login')) // patient login
app.use('/patientRegister', require('./router/patient/auth/register')) // patient register
app.use('/completePatientProfile', require('./router/patient/profile/completeProfile')) // complete profile