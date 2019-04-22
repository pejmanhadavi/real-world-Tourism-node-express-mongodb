const express = require('express');
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
const panelRoute = require('../app/routes/panel');


//admin panel
const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');

const {User} = require('../app/dao/user');
const {Experience} = require('../app/dao/experience');
const {ForgotPassword} = require('../app/dao/forgot_password');
const {Rate} = require('../app/dao/rate');
const {Request} = require('../app/dao/request');
const {TourLeader} = require('../app/dao/tour_leader');
const {UserRefresh} = require('../app/dao/user_refresh');
const {Pay} = require('../app/dao/pay');

AdminBro.registerAdapter(AdminBroMongoose);


const adminBro = new AdminBro({
	resources: [
		{resource: User,options: {name: 'مدیریت کاربران'}},
		{resource: Experience, options: {name: 'مدیریت تجربه ها'}},
		{resource: TourLeader, options: {name: 'مدیریت راهنما ها'}},
		{resource: Request, options: {name: 'مدیریت درخواست ها'}},
		{resource: Pay, options: {name: 'مدیریت پرداخت ها'}},
		{resource: Rate, options: {name: 'مدیریت نظرات'}},
		ForgotPassword,
		UserRefresh,],
	branding: {
		companyName: 'پنل مدیریتی تورآسو',
	},
	rootPath: '/admin'
});

const router = AdminBroExpressjs.buildRouter(adminBro);



module.exports = app => {
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
	//admin panel

	app.use('', panelRoute);
	app.use(adminBro.options.rootPath, router);

	app.use('/', indexRouter);
	app.use('/users', usersRouter);
	app.use('/auth', authRouter);
	app.use('/profile', profileRouter);
	app.use('/tourLeader', tourLeaderRouter);
	app.use('/request', requestRoute);
	app.use('/rate', rateRoute);
	app.use('/pay', payRoute);
};
