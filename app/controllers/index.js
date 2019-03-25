const {isIDGood} = require('./base');

const {TourLeader}  = require('../dao/tour_leader');
const {Rate} = require('../dao/rate');
const {User} = require('../dao/user');
const {handleResponse}  = require('../services/response_handler');
const {Experience} = require('../dao/experience');

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
		const experiences = await Experience.find({}, '_id title cost');
		const data =  {
			tourLeaders: tourLeaders,
			rates: rates,
			experiences: experiences
		};
		handleResponse(res, 200, 'MAIN_PAGE', data);

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


		const data = {
			tourLeaders: tourLeaders,
			rates: rates,
			userInfo: userInfo,
			experiences: experiences
		};
		handleResponse(res, 200, 'LOGGED_IN_MAIN_PAGE', data);

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

		const data = {
			userInfo: userInfo,
			tourLeaderInfo: tourLeaderInfo,
			rate: rate
		};
		handleResponse(res, 200, 'ME_PAGE', data);
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

		const data = {
			userInfo: userInfo,
			tourLeaderInfo: tourLeaderInfo
		};
		handleResponse(res, 200, 'PROFILE_PAGE', data);
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
		const tourLeader = await TourLeader.findOne({user: id}, '_id experiences');
		if (tourLeader === null)
			res.status(404).json({error: {code: 404, message: 'NOT_FOUND'}}).end();
		const userInfo = await User.findById(id, 'name city motto profileImages iWillShowYou aboutMe languages travelFacilities');
		const rate = await Rate.find({tourLeader: tourLeader._id}, '-updatedAt');
		const experiencesInfo = Experience.getProfileAndCostOfExperiences(tourLeader.experiences);
		const data = {
			tourLeaderInfo: tourLeader,
			userInfo : userInfo,
			rate: rate,
			experiences: experiencesInfo
		};

		handleResponse(res, 200, 'TOUR_LEADER_PAGE', data);
	}  catch (err) {
		next(err);
	}
};
