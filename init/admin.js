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
	// one-document models
	// is_single: true,
 
	// labels
	label: 'مدیریت کاربران',
	singular: 'Song',
 
	// filters: ['artist', 'year'],
 
	// // additional actions on this model
	// actions: [
	// 	{
	// 		id: 'release',
	// 		label: 'Release',
	// 		func: function (user, ids, callback) {
	// 			console.log('You just released songs ' + ids);
	// 			callback();
	// 		}
	// 	}
	// ],
 
	// // list of fields to be displayed by formage for this model
	// list: ['number', 'title', 'album', 'artist', 'year'],
	
	// // order documents, save order in this field (type: Number)
	// sortable: 'order',
 
	// // list of order fields
	// order_by: ['-year', 'album', 'number'],
 
	// // list of fields that must be populated
	// // (see http://mongoosejs.com/docs/api.html#document_Document-populate)
	// list_populate: ['album'],
 
	// // list of fields on which full-text search is available
	// search: ['title', 'album', 'artist']
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
