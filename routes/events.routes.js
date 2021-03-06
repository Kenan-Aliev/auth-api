const Event = require('../models/eventsModel')
const express = require('express')
const router = new express()
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/post', authMiddleware,
    async (req, res) => {
        try {
            const {title, description, phone, city, type, date, address, photos, email} = req.body
            await new Event({
                title,
                description,
                phone,
                city,
                type,
                date,
                photos,
                address,
                userEmail: email,
                user: req.user.id
            }).save()
            return res.json({events: await Event.find({})})
        } catch (error) {
            return res.status(500).json({message: 'Server error', error})
        }

    })

router.delete('/delete/:id', authMiddleware,
    async (req, res) => {
        try {
            const {id} = req.params
            let findEvent = await Event.findOne({_id: id, user: req.user.id})
            if (!findEvent) {
                return res.status(400).json({message: 'Event was not found'})
            }
            await Event.deleteOne(findEvent)
            return res.json({
                message: 'Event was deleted',
                userEvents: await Event.find({user: req.user.id}),
                allEvents: await Event.find({})
            })
        } catch (error) {
            return res.status(500).json({message: 'Server error', error})
        }

    })

router.get('/getUsersEvents', authMiddleware,
    async (req, res) => {
        try {
            const getEvents = await Event.find({user: req.user.id})
            return res.json({
                events: getEvents,
                total: getEvents.length
            })
        } catch (error) {
            return res.status(500).json({message: 'Server error', error})
        }
    })

router.get('/getByTypeName/:typeName', async (req, res) => {
    try {
        const {typeName} = req.params
        const events = await Event.find({type: typeName})
        return res.json({
            events,
            total: events.length
        })

    } catch (error) {
        return res.status(500).json({message: 'Server error', error})
    }

})


router.get('/getByCityName/:cityName', async (req, res) => {
    try {
        const {cityName} = req.params
        const events = await Event.find({city: cityName})
        return res.json({
            events,
            total: events.length
        })
    } catch (error) {
        return res.status(500).json({message: "Server error", error})
    }
})


router.get('/getAll', async (req, res) => {
    try {
        const events = await Event.find({})
        return res.json({
            events,
            total: events.length
        })
    } catch (error) {
        return res.status(500).json({message: "Server error", error})
    }
})

router.get('/search', async (req, res) => {
    try {
        const {title} = req.query
        let events = await Event.find({})
        events = [...events.filter(el => el.title.toLowerCase().includes(title.toLowerCase()))]
        if (events.length === 0) {
            return res.status(400).json({message: "По вашему запросу ничего не найдено!"})
        }
        return res.json({
            events,
            total: events.length
        })
    } catch (error) {
        return res.status(500).json({message: 'Server error', error})
    }

})


router.get('/getMoreInfo/:eventId', async (req, res) => {
    try {
        const {eventId} = req.params
        let event = await Event.findOne({_id: eventId})
        if (!event) {
            return res.status(400).json({message: "Ивент не был найден"})
        }
        event.views++
        await event.save()
        return res.json({
            event
        })

    } catch (error) {
        return res.status(500).json({message: "Server error"})
    }
})


module.exports = router