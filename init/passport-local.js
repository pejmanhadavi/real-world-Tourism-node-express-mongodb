const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/dao/user').User;
const bcrypt = require('bcrypt');
const {saveLoginAttemptsToDB} = require('../app/dao/user');
const {user_dao} = require('../messages');



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
                    return done(null, false, {message: user_dao.USER_NOT_FOUND});
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) return done(err);
                        if (isMatch) return done(null, user);
                        else return done(null, false, {message: user_dao.PASSWORDS_DO_NOT_MATCH});
                    });

            })
            .catch(err => {
                return done(err);
            });
}));

exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/panel/login')
};
