const db = require('../config/db')
const { decrypt, compare } = require('./encrypt')

const validateCredential = (req, res, next) => {
    const header = req.headers;
    let api_key = header['x-api-key'];
    let client_id = decrypt(header['x-access-key']);
    db('user').where('user_id', client_id).then(async (rows) => {
        if (rows.length > 0) {
            let isValidCredentials = await compare(rows[0].registration_date.toString(),api_key);
            if(isValidCredentials){
                next();
            }
            else{
                res.status(401).json({
                    message: "Unauthorized",
                })
            }
        }
        else{
            res.status(401).json({
                message: "Unauthorized",
            })
        }
    });
}

module.exports = validateCredential;