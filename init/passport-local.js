const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../app/dao/user').User;
const bcrypt = require('bcrypt');
const {saveLoginAttemptsToDB} = require('../app/dao/user');

const localLogin = new localStrategy((email, password, done) => {
    User.findOne({
        email,
        verified: true
    })
        .then(async result => {
            if (!result)
                return done(null, false);

            /*******************
             *                  *
             *    USER CHECK    *
             *                  *
             *                  */
            await User.userIsBlocked(result);
            await User.checkLoginAttemptsAndBlockExpires(result);
            /*                  *
             ********************/

            bcrypt.compare(password, result.password, async (err, isMatch) => {
                if (err)
                    done(null, false);
                if(!isMatch){
                    /*******************
                     *                  *
                     *    USER CHECK    *
                     *                  *
                     *                  */
                    await User.passwordsDoNotMatch(result);
                    /*                  *
                     ********************/
                    done(null, false);
                }
                /*******************
                 *                  *
                 *    USER CHECK    *
                 *                  *
                 *                  */
                result.loginAttempts = 0;
                /*                  *
                 ********************/
                await saveLoginAttemptsToDB(result);
                done(null, result);
                }
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
