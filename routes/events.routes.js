const Event = require('../models/eventsModel')
const express = require('express')
const router = new express()
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/post',authMiddleware,
    async (req,res)=>{
    try{
        const { title, description,phone,city,type,startDate,address } = req.body
        const addEvent = await new Event({title,description,phone,city,type,startDate,address,user:req.user.id}).save()
        return res.json(addEvent)
    }catch(error){
        return res.json({message:'Server error',error})
    }

})

router.delete('/delete/:id',authMiddleware,
    async (req,res)=>{
    try{
        const {id} = req.params
        let findEvent = await Event.findOne({_id:id,user:req.user.id})
        if(!findEvent){
            return res.status(400).json({message:'Event was not found'})
        }
            await Event.deleteOne(findEvent)
        return res.json({message:'Event was deleted',events:await Event.find({user:req.user.id})})
    }
    catch(error){
        return res.json({message:'Server error',error})
    }

})

router.get('/getUsersEvents',authMiddleware,
    async (req,res)=>{
    try{
       const getEvents = await Event.find({user:req.user.id})
        return res.json({
            events:getEvents,
            total:getEvents.length
        })
    }
    catch(error){
        return res.json({message:'Server error',error})
    }
})

router.get('/getByTypeId/:typeId',async(req,res)=>{
    try{
        const {typeId} = req.params
        const events = await Event.find({type:typeId})
        return res.json({
            events,
            total:events.length
        })

    }catch(error){
    return res.json({message:'Error',error})
    }

})


router.get('/getByCityId/:cityId', async(req,res)=>{
    try{
        const {cityId} = req.params
        const events = await Event.find({city:cityId})
        return res.json({
            events,
            total:events.length
        })
    }catch(error){
        return res.json({message:"Server error",error})
    }
})


router.get('/getAll', async (req,res)=>{
    try{
        const events = await Event.find({})
        return res.json({
            events,
            total:events.length
        })
    }catch(error){
        return res.json({message:"Server error",error})
    }
})

module.exports = router