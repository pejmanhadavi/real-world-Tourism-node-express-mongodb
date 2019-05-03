
//CONFIGURE ADMIN PANEL
const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');

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

AdminBro.registerAdapter(AdminBroMongoose);

const extraInfo = {
	name: 'extra info',
};

const util = require('util');

const adminBro = new AdminBro({
	resources: [
		{resource: User, options: {name: 'کاربران', listProperties: ['name', 'email', 'phone', 'isAdmin', 'phoneVerified', 'city', 'createdAt', 'updatedAt']}},
		{resource: Province, options: {name: 'استان', listProperties: ['name']}},
		{resource: City, options: {name: 'شهر', listProperties: ['name', 'province']}},
		{resource: Facility, options: {name: 'امکانات سفر', listProperties: ['name']}},
		{resource: Experience, options: {name: 'مدیریت تجربه ها',  listProperties: ['title', 'cost', 'profile', 'reviews']}},
		{resource: Request, options: {name: 'مدیریت درخواست ها', listProperties: ['user', 'tourLeader', 'experiences', 'paid', 'factorNumber']}},
		{resource: TourLeader, options: {name: 'مدیریت راهنما ها', properties: {
			experiences: { render: {
				list: (property, record, h) => {
					console.log('++++++++++++++++++++++++++++'+util.inspect(record.param('experiences.0')));
					return record.param('experiences.0');
				}
			} }}, listProperties: ['user', 'verified', 'reviews', 'experiences']}},
		{resource: Pay, options: {name: 'مدیریت پرداخت ها', listProperties: ['amount', 'factorNumber', 'transactionId', 'cardNumber']}},
		{resource: Rate, options: {name: 'مدیریت نظرات', listProperties: ['tourLeader', 'user', 'star', 'comment']}},
		{resource: ForgotPassword, options: {parent: extraInfo,}},
		{resource: UserRefresh, options: {parent: extraInfo}}],
	branding: {
		companyName: 'پنل مدیریتی تورآسو',
	},
	rootPath: '/admin'
});

const router = AdminBroExpressjs.buildRouter(adminBro);

exports.router = router;
exports.adminBro = adminBro;
