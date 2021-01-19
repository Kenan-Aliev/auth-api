const ToDo = require('../models/todosModel')
const express = require('express')
const router = new express()
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/post',authMiddleware,
    async (req,res)=>{
    try{
        const { title, description } = req.body
        const addToDo = await new ToDo({title,description,user:req.user.id}).save()
        return res.json(addToDo)
    }catch(e){
        return res.json({message:'Server error',e})
    }

})

router.delete('/delete/:id',authMiddleware,
    async (req,res)=>{
    try{
        const {id} = req.params
        let findTodo = await ToDo.findOne({_id:id,user:req.user.id})
        if(!findTodo){
            return res.status(400).json({message:'Todo was not found'})
        }
            await ToDo.deleteOne(findTodo)
        return res.json({message:'ToDo was deleted'})
    }
    catch(e){
        return res.json({message:'Server error',e})
    }

})

router.get('/get',authMiddleware,
    async (req,res)=>{
    try{
       const getToDos = await ToDo.find({user:req.user.id})
        delete getToDos.splice(0,1)
        return res.json(getToDos)
    }
    catch(e){
        return res.json({message:'Server error',e})
    }
})


module.exports = router