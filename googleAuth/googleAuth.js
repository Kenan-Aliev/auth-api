const passport = require('passport')
require('./passport-setup')
const express = require('express')
const router = new express()
const jwt = require('jsonwebtoken')
const config = require('config')

router.get('/auth', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/failed', (req, res) => {
    res.redirect('http://localhost:3000?auth=error')
})

router.get('/successAuth', passport.authenticate('google', {failureRedirect: '/failed'}),
    (req, res) => {
        const token = jwt.sign({id: req.user._id}, config.get('secretKey'), {expiresIn: '24h'})
        res.redirect('http://localhost:3000?token=' + token)
    }
)

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('http://localhost:3000?auth=loggedout')
})
module.exports = router