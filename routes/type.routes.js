const express = require('express')
const router = new express()
const Type = require('../models/typeOfEventModel')

router.post('/addType',async (req,res)=>{
    try{
        const {name} = req.body
        if(name){
            const newType = await new Type({name}).save()
            return res.json({newType})
        }
        else{
            return res.json({message:'Введите название ивента'})
        }

    }catch(error){
        return res.json({message:"Что то пошло не так",error})
    }

})

router.get('/getTypes',async (req,res) => {
    try{
        const types = await Type.find({})
        return res.json({types})
    }catch(error){
        return res.json({message:"Server error",error})
    }

})

module.exports = router