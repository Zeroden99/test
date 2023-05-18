const router = require('express').Router()
const authControllers = require('../controllers/authControllers')
const { body } = require('express-validator');
const passport = require("passport");
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config()




router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const { token } = req.user;
        // Successful authentication, redirect home.
        res.redirect('/');
        
    });
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook authentication callback route
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

router.post('/signUp', authControllers.regUser)
router.post('/signIn', authControllers.loginUser)
router.post('/logout', authControllers.logout)



module.exports = router