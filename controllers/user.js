const express = require('express')
const app = express.Router()
const db = require('../config/db')
const bcrypt = require('bcrypt')
const enc = require('../helpers/encrypt')
const { v, validateRequest } = require('../helpers/validation')
const moment = require('moment/moment')

async function hashIt(password) {
    try {
        const saltRounds = 10 // Number of salt rounds used for hashing (higher value means more secure but slower hashing)
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    } catch (error) {
        throw error
    }
}


app.use(express.urlencoded({
    extended: true
}))
//validation
const registerSchema = v.object({
    email: v.string().email(),
    password: v.string(),
})

app.post('/register', validateRequest(registerSchema), async (req, res) => {
    const body = req.body
    let email = body.email
    let password = await hashIt(body.password)

    // check current email 
    let checkUser = await db('user').where('email', email)
    if (checkUser.length > 0) {
        return res.status(500).json({
            message: "Email already exists",
        })
    }

    //insert
    await db('user').insert({
        email: email,
        password: password
    })
    .returning('id')
    .then(([id]) => {
        let encryptedId = enc.encrypt(id.toString())
        res.json({
            message: "success",
            data: {
                id: encryptedId
            }
        })
    }).catch((err) => {
        res.status(500).json({
            message: err,
        })
    })
})

app.post('/verify-account', (req, res) => {
    //verifi account here
    res.send(new Date())
})

app.post('/login', async (req, res) => {
    const body = req.body
    let email = body.email
    let password = body.password

    let user = db('user').where('email', email)
    user.then(async (rows) => {
        if (rows.length > 0) {
            let isValidPassword = await enc.compare(rows[0].password,password)
            if (isValidPassword) {
                db('user').where('user_id',rows[0].user_id).update('last_signin',moment().format('YYYY-MM-DD HH:mm:ss')).catch((err) => {
                    return res.json(err)
                })
                let token = await hashIt(rows[0].registration_date.toString())
                res.json({
                    message: "Authenticated",
                    data: {
                        'user_credentials': enc.encrypt(rows[0].user_id.toString()),
                        'user_access_token': token,
                    }
                })
            }
            else {
                res.status(401).json({
                    message: "Unauthenticated!",
                })
            }
        }
        else {
            res.status(401).json({
                message: "Unauthenticated!",
            })
        }
    })
        .catch((err) => {
            res.errored(err)
        })
})

module.exports = app
