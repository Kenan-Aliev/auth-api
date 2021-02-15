const express = require('express')
const router = new express()
const User = require('../models/userModel')
const Event = require('../models/eventsModel')

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
        return res.json({message: "Server error", error})
    }


})


module.exports = router