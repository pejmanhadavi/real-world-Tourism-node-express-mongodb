const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/dao/user').User;
const bcrypt = require('bcrypt');
const {saveLoginAttemptsToDB} = require('../app/dao/user');




passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    {
    usernameField: 'email',
    passwordField: 'password',
    session: false
},
    (username, password, done) => {
        User.findOne({
            email: username,
            verified: true
        })
            .then(user => {
                if (!user)
                    return done(null, false, {message: 'Unknown User'});
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) return done(err);
                        if (isMatch) return done(null, user);
                        else return done(null, false, {message: 'Invalid Password'});
                    });

            })
            .catch(err => {
                return done(err);
            });
}));
