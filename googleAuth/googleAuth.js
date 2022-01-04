const passport = require('passport')
require('./passport-setup')
const express = require('express')
const router = new express()
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const keys = require('../keys/index')

router.get('/auth', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/failed', (req, res) => {
    res.redirect(`${keys.client_url}?auth=error`)
})

router.get('/successAuth', passport.authenticate('google', {failureRedirect: '/failed'}),
    (req, res) => {
        const token = jwt.sign({id: req.user._id}, keys.secretKey, {expiresIn: '1m'})
        res.redirect(`${keys.client_url}/google/auth/` + token)
    }
)

router.post('/token/checkout', async (req, res) => {
    try {
        const {token} = req.body
        const decode = jwt.verify(token, keys.secretKey)
        if (!decode) {
            return res.status(400).json({message: 'Неверный токен'})
        }
        const user = await User.findOne({_id: decode.id})
        const newToken = jwt.sign({id: user._id}, keys.secretKey, {expiresIn: '24h'})
        return res.json({
            message: "ОК",
            newToken
        })
    } catch (error) {
        return res.status(500).json({message: 'Server error', error})
    }

})

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect(`${keys.client_url}/auth`)
})
module.exports = router