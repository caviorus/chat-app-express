const express = require('express')
const app = express.Router()
const db = require('../config/db')
const { decrypt } = require('../helpers/encrypt')
const validateCredential = require('../helpers/auth')
const { inspect } = require('util')
app.use(express.json())
app.use(validateCredential)


