const {isIDGood} = require('./base');
const {TourLeader} = require('../dao/tour_leader');
const {Experience} = require('../dao/experience');
const {handleResponse} = require('../services/response_handler');
const {leader_controller} = require('../../messages');
/****************
 * REGISTER TOUR LEADER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.registerTourLeader = async (req, res, next) => {
	try{
		const id = await isIDGood(req.user._id);
		await TourLeader.tourLeaderExists(id);
		const response = await TourLeader.registerTourLeader(req, id);
		handleResponse(res, 201, leader_controller.TOUR_LEADER_REGISTER_WAIT_UNTIL_VERIFY, response);
	}catch (err) {
		next(err);
	}
};


/***************************************
 * EDIT TOUR LEADER PROPERTIES
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.edit = async (req, res, next) => {
	try{
		const id = await isIDGood(req.user._id);
		await TourLeader.tourLeaderDoesNotExists(id);
		await Experience.checkTheExperiences(req.body.experiences);
		const response = await TourLeader.edit(req, id);
		handleResponse(res, 200, leader_controller.TOUR_LEADER_EDITED, response);
	}catch (err) {
		next(err);
	}
};
