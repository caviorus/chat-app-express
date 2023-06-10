const express = require('express');
const app = express.Router();
const db  = require('../config/db');
const { decrypt } = require('../helpers/encrypt')
const validateCredential = require('../helpers/auth')

app.use(express.json());
app.use(validateCredential)

app.get('/conversation', (req,res) => {
    let header = req.headers;
    let client_id = decrypt(header['x-access-key']);
    
    try {
        let conversation = db('participant').where('participant.user_id',client_id).join('conversation','conversation.conversation_id', '=', 'participant');
        if(conversation.length > 0){
            conversation.each((key,value) => {
                let last_message = db('message').where('conversation_id',value.conversation_id).orderBy('conversation_id','desc').limit(1);
                conversation[key].last_mesage = last_message;
            })
        }
    
        res.json(conversation);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.post('/conversation/add', (req,res) => {
    let header = req.headers;
    let body = req.body;

    let client_id = decrypt(header['x-access-key']);
    let type = body.type;
    let name = body.name ?? "";
    let icon = body.icon ?? "";
    let partner_id = decrypt(body.partner_id);
    let content = body.content;

    console.log('here first');
        console.log(partner_id);
        console.log(name);
        console.log(type);
        console.log(icon.length == 0 ? "['partner_name']" : icon);
        console.log({
            name: name.length == 0 ? "['partner_name']" : name,
            type: type,
            icon: icon.length == 0 ? "['partner_name']" : icon,
        });
        console.log('test');
        db('conversation').insert({
            name: name.length == 0 ? "['partner_name']" : name,
            type: type,
            icon: icon.length == 0 ? "['partner_name']" : icon,
        })
        .returning('id')
        .then(async([id]) => {
            console.log('here');
            if(type === "private"){
                await db('participant').insert([
                    {
                        conversation_id: id,
                        user_id: client_id,
                    },
                    {
                        conversation_id: id,
                        user_id: partner_id,
                    }
                ]).then(() => {
                    db('message').insert({
                        conversation_id: id,
                        user_id: client_id,
                        content: content,
                    }).then(() => {
                        res.status(201).json({
                            message: 'success',
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            message: "Error!",
                            data: err
                        });
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        message: "Error!",
                        data: err
                    });
                });
            }

        })
        .catch((err) => {
            res.status(500).json({
                message: "Error!",
                data: err
            });
        });
});

module.exports = app