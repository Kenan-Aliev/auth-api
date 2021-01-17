const express = require('express')
const router = new express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check , validationResult} = require('express-validator')
const User = require('../models/userModel')

router.post('/registration',
    [
        check('email','Uncorrect email').isEmail(),
        check('username','Uncorrect username').isString().isLength({min:3,max:10}),
        check('phone','Uncorrect phone').isNumeric().isLength({min:3,max:15}),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({min:3, max:12})
    ],
    async (req,res)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:'Uncorrect request',errors})
        }
        const {email , username ,phone, password} = req.body
        User.findOne({
            $or: [{
                email
            }, {
                username
            }]
        }).then(async user => {
            if (user) {
                let errors = {};
                if (user.email === email) {
                    errors.email = "Email already exists";
                } else {
                    errors.username = "User Name already exists";
                }
                return res.status(400).json(errors);
            } else {
                const hashPassword = await bcrypt.hash(password,8)
                await new User({
                    email,
                    username,
                    phone,
                    password: hashPassword
                }).save()
                return res.json({message:'User was created'})
            }
    })
    }
    catch(error){
    return res.json({message:'Server error',error})
    }
})



router.post('/login',async (req,res)=>{
try{
    const {email,password} = req.body
    const findUser = await User.findOne({email})
    if(!findUser){
        return res.status(400).json({message:'User not found'})
    }
    const checkPassword = bcrypt.compareSync(password,findUser.password)
    if(!checkPassword){
        return res.status(400).json({message:'Password is not correct'})
    }
const token = jwt.sign({id:findUser._id}, config.get('secretKey'), {expiresIn: "1h"})
    return res.json({
        token,
        user:{
            id: findUser._id,
            email: findUser.email,
            username: findUser.username,
            phone:findUser.phone
        }
    })
}catch(error){
    console.log(error)
    res.send({message: "Server error"})
}
})


module.exports = router