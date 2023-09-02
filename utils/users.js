const User = require('../models/User');
const bcrypt = require('bcryptjs');
const createError = require('../utils/error');
const jwt = require('jsonwebtoken')
const tokenService = require('./token')

class UserService {
    async registrationUser(userData) {
        const {email, password} = userData
        const newUser = await User.findOne({email})
        if (newUser) {
            throw createError(400, `${email} has been already have account`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await User.create({ ...userData, password: hashPassword })
        const tokens = tokenService.generateTokens({id: user._id, email: user.email})
        await tokenService.saveToken(user.id, tokens.refreshToken)
        return { ...tokens , user: user}
    }
    async loginUser(email, password) {
        const user = await User.findOne({ email })
        if (!user) throw createError(404, 'User Not Found')
        const correctPassword = await bcrypt.compare(password, user.password)
        if (!correctPassword) throw createError(400, 'Wrong Credentials')
        const tokens = tokenService.generateTokens({ id: user._id, email: user.email })
        await tokenService.saveToken(user.id, tokens.refreshToken)
        return ({...tokens, user: user.id})
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }
}

module.exports = new UserService()