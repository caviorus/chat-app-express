const express = require('express')
const { z } = require('zod')
const v = z
const validateRequest = (schema) => {
    return (req, res, next) => {
        const data = req.body
        try {
            schema.parse(data)
            next()
        } catch (error) {
            res.status(400).json({ error: JSON.parse(error.message) })
        }
    }
}

module.exports = { v, validateRequest }