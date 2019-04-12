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
		usernameField: 'phone',
		passwordField: 'password',
		session: false
	},
	(username, password, done) => {
		User.findOne({
			phone: username,
			isAdmin: true
		})
			.then(async user => {
				if (!user)
					return done(null, false, {message: user_dao.USER_NOT_FOUND});
				await User.userIsBlocked(user);
				await User.checkLoginAttemptsAndBlockExpires(user);
				bcrypt.compare(password, user.password, async (err, isMatch) => {
					if (err) return done(err);
					if (isMatch) {
						user.loginAttempts = 0;
						await saveLoginAttemptsToDB(user);
						return done(null, user);
					} else {
						User.passwordsDoNotMatch(user);
						return done(null, false, {message: user_dao.PASSWORDS_DO_NOT_MATCH});
					}
				});

			})
			.catch(err => {
				return done(err);
			});
	}));

exports.ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/panel/login');
};

exports.rememberMe = req => {
	if (req.body.remember)
		req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
	else
		req.session.cookie.expires = false; // Cookie expires at end of session
};
