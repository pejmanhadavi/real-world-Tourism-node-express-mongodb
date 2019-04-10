const {isIDGood} = require('./base');
const {TourLeader} = require('../dao/tour_leader');
const {Rate} = require('../dao/rate');
const {handleResponse} = require('../services/response_handler');
const {rate_controller} = require('../../messages');

/**************************
 * RATE CONTROLLER
 * @param req
 * @param res
 * @param next
 */
exports.rateTourLeader = async (req, res, next) => {
	try{
		const userId = await isIDGood(req.user._id);
		const tourLeaderId = await isIDGood(req.body.tourLeaderId);
		await TourLeader.tourLeaderCheckForRequest(tourLeaderId);
		const response = await Rate.saveRate(req, tourLeaderId, userId);
		handleResponse(res, 201, rate_controller.RATED, response);
	} catch (err) {
		next(err);
	}
};

