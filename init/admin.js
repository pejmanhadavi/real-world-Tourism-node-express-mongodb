const formage = require('formage');

const {User} = require('../app/dao/user');
const {City, Province} = require('../app/schemas/city-province');
const {Facility} = require('../app/schemas/facility ');
const {Experience} = require('../app/dao/experience');
const {ForgotPassword} = require('../app/dao/forgot_password');
const {Rate} = require('../app/dao/rate');
const {Request} = require('../app/dao/request');
const {TourLeader} = require('../app/dao/tour_leader');
const {UserRefresh} = require('../app/dao/user_refresh');
const {Pay} = require('../app/dao/pay');



User.formage = {
	label: 'کاربران',
	list: ['name', 'phone', 'city', 'province', 'email', 'createdAt'],
	list_populate: ['city', 'province']
};

City.formage = {
	label: 'شهر ها',
};
Province.formage = {
	label: 'استان ها',
};

Facility.formage = {
	label: 'امکانات سفر',
};

Experience.formage = {
	label: 'تجربه ها',
	list: ['title', 'cost', 'reviews'],
};
ForgotPassword.formage = {
};
Rate.formage = {
	label: 'نظرات و ستاره ها',
	list: ['tourLeader', 'user', 'star', 'comment'],
};
Request.formage = {
	label: 'درخواست ها',
	list: ['user', 'tourLeaderUserId', 'experiences', 'paid', 'factorNumber', 'createdAt'],
};
TourLeader.formage = {
	label: 'راهنما ها',
	list: ['user', 'verified', 'experiences', 'reviews', 'createdAt'],
};
UserRefresh.formage = {
};
Pay.formage = {
	label: 'پرداخت ها',
	list: ['factorNumber', 'transactionId', 'amount', 'cardNumber', 'createdAt'],
};



	
	
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
	
	formage.init(app, express, models , {
		title: 'پنل ادمین تورآسو',
		root: '/admin',
		default_section: 'main',
		username: 'admin',
		password: 'admin',
		admin_users_gui: true
	});
};
