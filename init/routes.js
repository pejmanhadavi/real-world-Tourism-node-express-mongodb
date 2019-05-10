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
// const panelRoute = require('../app/routes/panel');

// const {adminBro, router} = require('./admin');

const formage = require('formage');
const {User} = require('../app/dao/user');
const {Province, City} = require('../app/schemas/city-province');
const {Facility} = require('../app/schemas/facility ');
const {Experience} = require('../app/dao/experience');
const {ForgotPassword} = require('../app/dao/forgot_password');
const {Rate} = require('../app/dao/rate');
const {Request} = require('../app/dao/request');
const {TourLeader} = require('../app/dao/tour_leader');
const {UserRefresh} = require('../app/dao/user_refresh');
const {Pay} = require('../app/dao/pay');


const models = {
	Facility: Facility,
	Experience: Experience,
	ForgotPassword: ForgotPassword,
	UserRefresh: UserRefresh,
	Province: Province,
	City: City,
	User: User,
	TourLeader: TourLeader,
	Rate: Rate,
	Request: Request,
	Pay: Pay,
};


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
	// //admin panel
	// app.use('', panelRoute);
	// app.use(adminBro.options.rootPath, router);
	formage.init(app, express, models , {
		title: 'پنل ادمین تورآسو',
		root: '/admin',
		default_section: 'main',
		username: 'admin',
		password: 'admin',
		admin_users_gui: true
	});


	app.use('/', indexRouter);
	app.use('/users', usersRouter);
	app.use('/auth', authRouter);
	app.use('/profile', profileRouter);
	app.use('/tourLeader', tourLeaderRouter);
	app.use('/request', requestRoute);
	app.use('/rate', rateRoute);
	app.use('/pay', payRoute);
};
