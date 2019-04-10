const {isIDGood} = require('./base');

const {Request} = require('../dao/request');
const {TourLeader} = require('../dao/tour_leader');
const {handleResponse} = require('../services/response_handler');
const {request_controller} = require('../../messages');

/****************************
 * SEND REQUEST CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.sendRequest = async (req, res, next) => {
	try {
		const userId = await isIDGood(req.user._id);
		const tourLeaderId = await isIDGood(req.body.tourLeader);
		await TourLeader.tourLeaderCheckForRequest(tourLeaderId);
		const tourLeader= await TourLeader.getTourLeaderById(tourLeaderId);
		await TourLeader.checkTheExperiences(tourLeaderId, req.body.experiences);
		const response = await Request.saveRequest(req, userId, tourLeaderId, tourLeader.user);
		handleResponse(res, 200, request_controller.REQUEST_SENT , response);
	}catch (err) {
		next(err);
	}
};
