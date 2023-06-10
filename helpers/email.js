const nodemailer = require('nodemailer');
const admin = require('firebase-admin')

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'caviorus@gmail.com',
    pass: '1z5ep0i192',
  },
});

const firebaseAdmin = () => {
    const firebaseAccount = require('../credentials/firebase-service-account.json')
    admin.initializeApp({
        credential: admin.credential.cert(firebaseAccount),
    })
    
    const sendVerificationLink =  (dstEmail, actionSetting) => {
        admin.auth().generateEmailVerificationLink(dstEmail, actionSetting);
    }

}



module.exports = { transporter, firebaseAdmin }
