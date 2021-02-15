const express = require('express')
const router = new express()
const City = require('../models/citiesModel')

router.post('/addCity',async (req,res)=>{
    try{
        const {name} = req.body
        if(name){
            const newCity = await new City({name}).save()
            return res.json({newCity})
        }
        else{
            return res.json({message:'Введите название города'})
        }

    }catch(error){
        return res.json({message:"Что то пошло не так",error})
    }

})

router.get('/getCities',async (req,res) => {
    try{
        const cities = await City.find({})
        return res.json({cities})
    }catch(error){
        return res.json({message:"Server error",error})
    }

})

module.exports = router