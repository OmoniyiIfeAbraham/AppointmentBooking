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
app.use('/deleteDoctor', require('./router/admin/doctors/deleteDoctor')) // delete doctor
app.use('/schedule', require('./router/admin/schedules/schedules')) // view schedules
app.use('/adminViewSchedule', require('./router/admin/schedules/viewSchedule')) // view individual schedule

// DOCTOR        res.render('doctor/auth/login', { msg: `${err.message}`})
app.use('/doctor', require('./router/doctor/profile/profile')) // doctor profile
app.use('/doctorRegister', require('./router/doctor/auth/register')) // doctor register
app.use('/doctorLogin', require('./router/doctor/auth/login')) // doctor login
app.use('/completeProfile', require('./router/doctor/profile/completeProfile')) // complete profile
app.use('/patientsD', require('./router/doctor/patients/patients')) // view patients
app.use('/viewPatientD', require('./router/doctor/patients/viewPatient')) // view patient
app.use('/schedules', require('./router/doctor/shedules/schedules')) // view appointments
app.use('/deleteSchedule', require('./router/doctor/shedules/deleteSchedule')) // delete Schedule
app.use('/viewSchedule', require('./router/doctor/shedules/viewSchedule')) // view Schedule
app.use('/resetPassword', require('./router/doctor/auth/reset')) // reset password
app.use('/view', require('./router/doctor/profile/view')) // view profile

// PATIENT
app.use('/patient', require('./router/patient/profile/profile')) // patient profile
app.use('/patientLogin', require('./router/patient/auth/login')) // patient login
app.use('/patientRegister', require('./router/patient/auth/register')) // patient register
app.use('/completePatientProfile', require('./router/patient/profile/completeProfile')) // complete profile
app.use('/book', require('./router/patient/booking/booking')) // Book Appointment
app.use('/reset', require('./router/patient/auth/reset')) // reset password
app.use('/viewProfile', require('./router/patient/profile/viewProfile')) // view profile

// LOGOUT ROUTES
app.use('/logout', require('./router/logout')) // Logout of session

// REMARKS
app.use('/remark', require('./router/remark/remark')) // remarks