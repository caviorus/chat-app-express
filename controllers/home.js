const express = require('express');
const app = express.Router();
const db = require('../config/db');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// generate user's conversation 
app.get('/', (req, res) => {
    let user = db.select('name').from('user');
    user.then((rows) => {
        res.json({
            data: rows,
        })
    })
    .catch((error) => {
        console.error(error);
    })
    .finally(() => {
        db.destroy();
    });
})

app.post('/new-conversation', (req, res) => {
    let user_id = req.body.hasOwnProperty('user_id') ? req.body.user_id : null;
    let user = db.select('name').from('user').where('user_id',user_id);
    user.then((rows) => {
        res.json({
            data: rows,
        });
    })
})
module.exports = app;

