// const {refreshToken} = require('../app/services/refresh_token_middleware');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const messages = require('express-messages');

const indexRouter = require('../app/routes/index');
const usersRouter = require('../app/routes/users');
const authRouter = require('../app/routes/auth');
const profileRouter = require('../app/routes/profile');
const tourLeaderRouter = require('../app/routes/tour_leader');
const requestRoute = require('../app/routes/request');
const rateRoute = require('../app/routes/rate');
const payRoute = require('../app/routes/pay');
const formageAdmin = require('./admin');

module.exports = (express, app) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cors());
	app.use(cookieParser());

	app.use(session({
		secret: process.env.JWT_SECRET,
		saveUninitialized: true,
		resave: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	app.use((req, res, next) => {
		res.locals.messages = messages(req, res);
		next();
	});
	// app.use(refreshToken);
	app.set('view engine', 'ejs');
	formageAdmin(express, app);


	app.use('/', indexRouter);
	app.use('/users', usersRouter);
	app.use('/auth', authRouter);
	app.use('/profile', profileRouter);
	app.use('/tourLeader', tourLeaderRouter);
	app.use('/request', requestRoute);
	app.use('/rate', rateRoute);
	app.use('/pay', payRoute);
};
