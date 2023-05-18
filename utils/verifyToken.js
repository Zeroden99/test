const jwt = require('jsonwebtoken')
const createError = require('./error')

const verifyToken = (req, res, next) => {
    const token = req.cookies.refreshToken
    if (!token) return next(createError(401, 'You are not authenticated'))

    jwt.verify(token, process.env.SECRET_KEY, (e, user) => {
        if (e) return next(createError(403, 'Token is not valid'))
        req.user = user
        next()
    })
}

module.exports = {verifyToken}