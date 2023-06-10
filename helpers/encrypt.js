const enc = require('crypto-js')
const bcrypt = require('bcrypt')
require('dotenv').config();

function encrypt(data) {
  let key = process.env.ENCRYPT_KEY;
  let encrypted = enc.AES.encrypt(data, key).toString();
  return encrypted;
}

function decrypt(data) {
  let key = process.env.ENCRYPT_KEY;
  const decryptedData = enc.AES.decrypt(data, key).toString(enc.enc.Utf8);
  return decryptedData;
}
async function hash(password) {
  try {
    const saltRounds = 10; // Number of salt rounds used for hashing (higher value means more secure but slower hashing)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}
async function compare(hashed_password,actual_password) {
  try {
    let compareStatus = await bcrypt.compare(actual_password, hashed_password);
    if (!compareStatus) {
      compareStatus = await bcrypt.compare(hashed_password, actual_password);
    }
    return compareStatus;
  } catch (error) {
    throw error;
  }
}

module.exports = { encrypt, decrypt, hash, compare }