const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel')
const keys = require('../keys/index')


passport.serializeUser(function (user, done) {
    done(null, user._id)
});


passport.deserializeUser(async function (user, done) {
    const findUser = await User.findOne({_id: user})
    done(null, findUser);
});


passport.use(new GoogleStrategy({
        clientID: "1025498963413-246gjim5ruibfh8ksjpkepsqj81055n1.apps.googleusercontent.com",
        clientSecret: "umK10imdQm_f56V_a9TsP9zq",
        callbackURL: `${keys.base_url}/google/successAuth`
    },
    async function (accessToken, refreshToken, profile, done) {
        const user = await User.findOne({googleId: profile.id})
        if (!user) {
            const newUser = await new User({
                email: profile._json.email,
                googleId: profile.id,
                username: profile.displayName
            }).save()
            return done(null, newUser)
        }
        return done(null, user);
    }
));