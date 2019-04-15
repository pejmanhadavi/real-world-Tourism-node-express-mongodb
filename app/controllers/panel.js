const {rememberMe} = require('../../init/passport-local');
const {User} = require('../dao/user');
const {TourLeader} = require('../dao/tour_leader');
const {Experience} = require('../dao/experience');
const {Pay} = require('../dao/pay');
const {Request} = require('../dao/request');
const {Rate} = require('../dao/rate');
const {dateConverter} = require('./base');

/*********************************
 * Get login controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getLogin = async (req, res, next) => {
	try{
		res.render('panel/login');
	}catch(err){
		next(err);
	}
};

/******************************
 * POST login controller
 * @param req
 * @param res
 * @param next
 */
exports.postLogin = (req, res, next) => {
	try {
		rememberMe(req);
		req.flash('success', 'You are now logged in');
		res.redirect('/panel/dashboard');
	}catch (err) {
		next(err);
	}
};

/*************************************
 * GET dashboard controller
 * @param req
 * @param res
 * @param next
 */
exports.dashboard = async (req, res, next) => {
	try {
		res.render('panel/dashboard', {
			registeredUsers: await User.numberOfRegisteredUsers(),
			registeredLeaders: await TourLeader.numberOfRegisteredLeaders(),
			totalPayment: await Pay.calculateTotalPayment(),
			totalReserved: await Request.numberOfRequests(),
			totalLeadersReviews: await TourLeader.calculateTotalReviews(),
			totalExperiencesReviews: await Experience.calculateTotalReviews(),
			totalComments: await Rate.numberOfRates(),
		});


	}catch (err) {
		next(err);
	}
};

/*************************************
 * GET users list
 * @param req
 * @param res
 * @param next
 */
exports.users_list = async (req, res, next) => {
	try{
		const users = await User.find().populate('city').lean();
		const leaders = await TourLeader.find();
		createdAtConverter(users);
		updatedAtConverter(users);
		setUserStatus(users, leaders);
		res.render('panel/users_list', {users: users});
	}catch(err) {
		next(err);
	}
};











/***************
 * PRIVATE FUNCTIONS
 */
const createdAtConverter = (items) => {
	items.forEach ( item => {
		item.createdAt = dateConverter(item.createdAt);
	});
};

const updatedAtConverter = (items) => {
	items.forEach ( item => {
		item.updatedAt = dateConverter(item.updatedAt);
	});
};

const setUserStatus = (users, leaders) => {
	leaders = leaders.map(a => a.user.toString());
	users.forEach(user => {
		if(leaders.indexOf(user._id.toString()) < 0)
			user.isLeader = 'گردشگر';
		else
			user.isLeader = 'راهنما';
	});
};
