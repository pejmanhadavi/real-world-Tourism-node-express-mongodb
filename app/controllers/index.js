const {isIDGood} = require('./base');

const {TourLeader}  = require('../dao/tour_leader');
const {Rate} = require('../dao/rate');
const {User} = require('../dao/user');
const {Message} = require('../dao/message');


/************************
 * MAIN PAGE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.mainPage  = async (req, res, next) => {
	try{

		const tourLeaders = await TourLeader.find({verified: true},'costPerDay _id user')
			.populate('user', '_id name city motto profileImages');
		const rates = await Rate.find({},'tourLeader user comment star');
		res.status(200).json({
			tourLeaders: tourLeaders,
			rates: rates
		});
	}  catch (err) {
		next(err);
	}
};


/***********************
 *  LOGGED IN CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.loggedIn = async (req, res, next) => {
	try{
		const userId = await isIDGood(req.user._id);

		const tourLeaders = await TourLeader.find({verified: true},'costPerDay _id user')
			.populate('user', '_id name city motto profileImages');

		const rates = await Rate.find({},'tourLeader user comment star');
		const userInfo = await User.findById(userId, 'name profileImages');

		const unreadMessages = await Message.count({author: {$ne: userId}})
			.populate({
				path: 'Request',
				match: {$or: [{user: userId}, {tourLeaderUserId: userId}]}
			});

		res.status(200).json({
			tourLeaders: tourLeaders,
			rates: rates,
			userInfo: userInfo,
			unreadMessages: unreadMessages
		});

	}  catch (err) {
		next(err);
	}
};

/***************************
 * ME CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.me = async (req, res, next) => {
	try{
		const userId = await isIDGood(req.user._id);
		const userInfo = await User.findById(userId, 'profileImages name motto languages');
		const tourLeaderInfo = await TourLeader.findOne({user: userId}, 'const _id');
		let rate = null;
		if (tourLeaderInfo)
			rate = await Rate.find({tourLeader: tourLeaderInfo._id}, 'star comment');

		res.status(200).json({
			userInfo: userInfo,
			tourLeaderInfo: tourLeaderInfo,
			rate: rate
		});
	}  catch (err) {
		next(err);
	}
};

/**************************
 * PROFILE CONTROLLER
 * @param req
 * @param res
 * @param next
 */
exports.profileSetting = async (req, res, next) => {
	try{
		const userId = await isIDGood(req.user._id);
		const userInfo = await User.findById(userId, 'profileImages name motto languages city aboutMe iWillShowYou email phone');
		const tourLeaderInfo = await TourLeader.findOne({user: userId}, 'const _id');

		res.status(200).json({
			userInfo: userInfo,
			tourLeaderInfo: tourLeaderInfo
		});
	}  catch (err) {
		next(err);
	}
};

/****************************
 * TOUR LEADER PAGE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.tourLeaderPage = async (req, res, next) => {
	try{
		const id = await isIDGood(req.params.userId);
		const tourLeader = await TourLeader.findOne({user: id}, '_id cost');
		if (tourLeader === null)
			res.status(404).json({error: {code: 404, message: 'NOT_FOUND'}}).end();
		const userInfo = await User.findById(id, 'name city motto profileImages iWillShowYou aboutMe languages travelFacilities');
		const rate = await Rate.find({tourLeader: tourLeader._id}, '-updatedAt');
		res.status(200).json({
			tourLeaderInfo: tourLeader,
			userInfo : userInfo,
			rate: rate
		});
	}  catch (err) {
		next(err);
	}
};