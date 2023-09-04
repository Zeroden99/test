const router = require('express').Router()
const authControllers = require('../controllers/authControllers')
const passport = require("passport");
const dotenv = require('dotenv');
require('../utils/passport')
dotenv.config()


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
        
    });

router.get('/auth/callback/success', (req, res) => {
    if (!req.user)
        res.redirect('/auth/callback/failure');
    res.send("Welcome " + req.user.email);
});

// failure
router.get('/auth/callback/failure', (req, res) => {
    res.send("Error");
})
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
router.put('/update', authControllers.updateUser)
router.post('/logout', authControllers.logout)



module.exports = router