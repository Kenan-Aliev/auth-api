const express = require('express')
const router = new express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check , validationResult} = require('express-validator')
const User = require('../models/userModel')
const ToDo = require('../models/todosModel')
const nodemailer = require('nodemailer')
const authMiddleware = require('../middlewares/auth.middleware')

const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'mailertest48@mail.ru',
            pass: 'Nodemailer'
        }
    },{
        from:'Mailer Test <mailertest48@mail.ru>'
    }
);


router.post('/registration',
    [
        check('email','Uncorrect email').isEmail(),
        check('username','Uncorrect username').isString().isLength({min:3,max:10}),
        check('phone','Uncorrect phone').isString().isLength({min:3,max:15}),
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
                const token = jwt.sign({email,username,phone,password},config.get('secretKey'),{expiresIn:'1h'})
                const message = {
                    from:'Mailer Test <mailertest48@mail.ru>',
                    to:email,
                    subject:'Account activation link',
                    html:`<h2>Пожалуйста, нажмите по ссылке ниже,чтобы подтвердить регистрацию на нашем сайте</h2>
                          <a href="${config.get('client-url')}/verification/${token}">Нажмите</a>`

                }
                await transporter.sendMail(message, (err, info) => {
                    if (err) {
                        return res.send({message:'Error',err})
                    }
                    return res.json({message:'Проверьте ваш почтовый ящик,чтобы подтвердить регистрацию',info})
                })
            }
     })
    }
    catch(error){
    return res.json({message:'Server error',error})
    }
})

router.post('/activation',async (req,res)=>{
    const {token} = req.body
    if(token){
        try{
            const decoded = jwt.verify(token,config.get('secretKey'))
            const {email,username,phone,password} = decoded
            const hashPassword = await bcrypt.hash(password,8)
            const newUser = await new User({email,username,phone,password:hashPassword}).save()
            await new ToDo({
                title:'Example title',
                description:'Example description',
                user:newUser._id
            }).save()
            return res.json({message:'Поздравляем! Вы успешно заррегистрировались на нашем сайте'})
        }
        catch(e){
            return res.json({message:'Неверный токен'})
        }
    }
    else{
        return res.json({message:'Что то пошло не так'})
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



router.get('/auth',authMiddleware,
    async (req,res)=>{
try{
    const findUser = await User.findOne({_id:req.user.id})
    const token = jwt.sign({id:findUser._id},config.get('secretKey'),{expiresIn: '1h'})
    return res.json({
        token,
        user:{
            id:findUser._id,
            email:findUser.email,
            username:findUser.username,
            phone:findUser.phone
        }
    })

}catch(error){
    return res.json({message:'Server error',error})
        }
    })


router.delete('/deleteUser',authMiddleware,
    async (req,res)=>{
    try{
        await User.findOneAndDelete({_id:req.user.id})
        return res.json({message:'User was deleted'})
    }
    catch(error){
        return res.json({message:'Server error',error})
    }
    })

module.exports = router