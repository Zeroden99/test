const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const tokenService = require('./token')


const dotenv = require('dotenv');
dotenv.config()



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ googleId: profile.id });
            if (user) {
                const tokens = tokenService.generateTokens({ id: user._id, email: user.email });
                await tokenService.saveToken(user.id, tokens.refreshToken);
                done(null, user);
            } else {
                const newUser = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    isGoogleUser: true
                });
                const tokens = tokenService.generateTokens({ id: newUser._id, email: newUser.email });
                await tokenService.saveToken(newUser.id, tokens.refreshToken);
                await newUser.save();
                done(null, newUser);
            }
        } catch (error) {
            done(error, null);
        }
    },
));
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email'],
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            } else {
                const newUser = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    isFacebookUser: true
                });
                await newUser.save();
                done(null, newUser);
            }
        } catch (error) {
            done(error, null);
        }
    },
));


// serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
