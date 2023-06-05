const express = require('express')
const app = express.Router()
const db = require('../config/db')
const bcrypt = require('bcrypt')

async function hashPassword(password) {
    try {
        const saltRounds = 10; // Number of salt rounds used for hashing (higher value means more secure but slower hashing)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}


app.use(express.urlencoded({
    extended: true
}))

app.post('/register', async (req, res) => {
    const body = req.body;
    let email = body.email;
    let password = await hashPassword(body.password);
    console.log(password);

    let insert = db('user').insert({
        email: email,
        password: password
    });

    insert.then((ok) => {
        res.json({
            message: "OK"
        })
    })
        .catch((err) => {
            res.status(500).json({
                message: err,
            })
        })
})

app.post('/login', async (req, res) => {
    const body = req.body;
    let email = body.email;
    let password = body.password;

    let user = db('user').where('email',email);
    user.then(async (rows) => {
        if(rows.length > 0){
            let isValidPassword = await bcrypt.compare(password,rows[0].password);
            if(isValidPassword){
                res.json({
                    message: "Authenticated",
                })
            }
            else{
                res.status(401).json({
                    message: "Unauthenticated!",
                })
                }
        }
        else{
            res.status(401).json({
                message: "Unauthenticated!",
            })
        }
    })
    .catch((err) => {
        res.errored(err);
    })
})

module.exports = app
