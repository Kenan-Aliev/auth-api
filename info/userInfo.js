const express = require('express')
const router = new express()
const User = require('../models/userModel')
const Event = require('../models/eventsModel')
const authMiddleware = require('../middlewares/auth.middleware')
const jwt = require('jsonwebtoken')
const config = require('config')

router.get('/:userId', async (req, res) => {
    try {
        const {userId} = req.params
        const user = await User.findOne({_id: userId})
        if (!user) {
            return res.status(400).json({message: 'Такой пользователь не найден'})
        }
        const events = await Event.find({user: user._id})
        return res.json({
            email: user.email,
            username: user.username,
            events,
            total: events.length
        })
    } catch (error) {
        return res.status(500).json({message: "Server error", error})
    }


})

router.get('/getAllUsers', async (req, res) => {
    try {
        const users = await User.find({})
        return res.json({
            users,
            total: users.length
        })
    } catch (e) {
        return res.status(500).json({message: "Server error"})
    }

})


router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.id})
        const events = await Event.find({user: req.user.id})
        return res.json({
            email: user.email,
            username: user.username,
            phone: user.phone,
            events
        })
    } catch (error) {
        return res.status(500).json({message: "Server Error", error})
    }

})

module.exports = router