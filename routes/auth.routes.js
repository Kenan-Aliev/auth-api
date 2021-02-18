const express = require('express')
const router = new express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../models/userModel')
const authMiddleware = require('../middlewares/auth.middleware')
const transporter = require('../mailer/nodeMailer')



router.post('/registration',
    [
        check('email', 'Uncorrect email').isEmail(),
        check('username', 'Uncorrect username').isString().isLength({min: 3}),
        check('phone', 'Uncorrect phone').isString().isLength({min: 3, max: 20}),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({min: 9})
    ],
    async (req, res) => {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return res.status(400).json({message: 'Ошибка при заполнении формы регистрации', error})
            }
            const {email, username, phone, password} = req.body
            User.findOne({
                $or: [{
                    email
                }, {
                    username
                }]
            }).then(async user => {
                if (user) {
                    if (user.email === email) {
                        return res.status(400).json({message:"Пользователь с таким имейлом уже существует"});
                    } else {
                        return res.status(400).json({message:"Пользователь с таким именем уже существует"});
                    }
                } else {
                    try {
                        const token = jwt.sign({
                            email,
                            username,
                            phone,
                            password
                        }, config.get('secretKey'), {expiresIn: '2m'})
                        const message = {
                            from: 'Mailer Test <mailertest48@mail.ru>',
                            to: email,
                            subject: 'Account activation link',
                            html: `<h2>Пожалуйста, нажмите по ссылке ниже,чтобы подтвердить регистрацию на нашем сайте</h2>
                          <a href="${config.get('client-url')}/verification/${token}">Нажмите</a>`

                        }
                        await transporter.sendMail(message, (error, info) => {
                            if (error) {
                                return res.status(400).send({message: 'По непонятным причинам сообщение не удалось отправить на вашу почту', error})
                            }
                            return res.json({
                                message: 'Проверьте ваш почтовый ящик,чтобы подтвердить регистрацию',
                                info
                            })
                        })
                    } catch (error) {
                        return res.status(400).json({message: "Произошла ошибка", error})
                    }
                }
            })
        } catch (error) {
            return res.json({message: 'Server error', error})
        }
    })

router.post('/activation', async (req, res) => {
	const {token} = req.body
	if (token) {
		try {
			const decoded = jwt.verify(token, config.get('secretKey'))
			const {email, username, phone, password} = decoded
			const hashPassword = await bcrypt.hash(password, 8)
			await new User({email, username, phone, password: hashPassword}).save()
			return res.json({message: 'Поздравляем! Вы успешно заррегистрировались на нашем сайте'})
		} catch (e) {
			return res.status(400).json({message: 'Неверный токен,попробуйте заново зарегистрироваться'})
		}
	} else {
		return res.status(400).json({message: 'Что то пошло не так'})
	}
})

router.post('/login', async (req, res) => {
	try {
		const {email, password} = req.body
		const findUser = await User.findOne({email})
		if (!findUser) {
			return res.status(400).json({message: 'User not found'})
		}
		const checkPassword = bcrypt.compareSync(password, findUser.password)
		if (!checkPassword) {
			return res.status(400).json({message: 'Password is not correct'})
		}
		const token = jwt.sign({id: findUser._id}, config.get('secretKey'), {expiresIn: "24h"})
		return res.json({
			token,
			user: {
				id: findUser._id,
				email: findUser.email,
				username: findUser.username,
				phone: findUser.phone
			}
		})
	} catch (error) {
		return res.status(400).send({message: "Server error", error})
	}
})

router.get('/auth', authMiddleware, async (req, res) => {
	try {
		const findUser = await User.findOne({ _id: req.user.id })
		const token = jwt.sign({ id: findUser._id }, config.get('secretKey'), { expiresIn: '24h' })
		return res.json({
			token,
			user: {
				id: findUser._id,
				email: findUser.email,
				username: findUser.username,
				phone: findUser.phone
			}
		})
	} catch (error) {
		return res.json({ message: 'Server error', error })
	}
})

router.delete('/deleteUser', authMiddleware, async (req, res) => {
	try {
		await User.findOneAndDelete({ _id: req.user.id })
		return res.json({ message: 'User was deleted' })
	} catch (error) {
		return res.json({ message: 'Server error', error })
	}
})

module.exports = router




