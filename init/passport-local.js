const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../app/dao/user').User;
const bcrypt = require('bcrypt');

const localLogin = new localStrategy((email, password, done) => {
    User.findOne({
        email,
        verified: true
    })
        .then(async result => {
            if (!result)
                return done(null, false);
            bcrypt.compare(password, result.password, (err, isMatch) =>
                err ? done(null, false) : done(null, result)
            );
        })
        .catch(err => {
            return done(null, false);
        });
});


passport.use(localLogin);


passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(result => {
            if (!result)
                return done(null, false);
            done(null, result);
        })
        .catch(err => done(err));
});
