const User = require('../models/User');
const bcrypt = require('bcryptjs');
const createError = require('../utils/error');
const jwt = require('jsonwebtoken')
const userService =  require('../utils/users')
const cookieParser = require('cookie-parser');

class authControllers{
    async regUser(req, res, next) {
        // try {
        //     const salt = bcrypt.genSaltSync(10)
        //     const hash = bcrypt.hashSync(req.body.password, salt)
        //     const newUser = new User({ ...req.body, password:hash })
        //     await newUser.save()
        //     res.status(200).json(newUser)
        // } catch (e) {
        //     next(e)
        // }
        try {
            const {email, username, login, password} = req.body
            const userData = { email, username, login, password }
            const user = await userService.registrationUser(userData)
            res.cookie('refreshToken', user.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.status(200).json(user)
        } catch (e) {
            next(e)
        }
    }
    async loginUser(req, res, next) {
        // try {
        //     const user = await User.findOne({ email: req.body.email })
        //     if (!user) return next(createError(404, 'User Not Found'))
        //     const correctPassword = await bcrypt.compare(req.body.password, user.password)
        //     if(!correctPassword) return next(createError(400, 'Wrong Credentials'))
        //     const token = jwt.sign({ id: user._id, email:user.email }, process.env.SECRET_KEY)
        //     const { password, ...others } = user._doc
        //     res.status(200).json({others, token})
        // } catch (e) {
        //     next(e)
        // }
        try {
            const {email, password} = req.body
            const userData = await userService.loginUser(email, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }
    async updateUser(req, res, next) {
        try {
            const userId = req.user.id;
            const newData = req.body;
            const result = await userService.updateUser(userId, newData);
            if (result.success) {
                res.status(200).json(result);
            } else {
                throw createError(400, 'Failed to update user');
            }
        } catch (e) {
            next(e)
        }
    }
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }
    
}



module.exports = new authControllers()