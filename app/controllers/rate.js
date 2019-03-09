const {isIDGood} = require('./base');

const {Rate} = require('../dao/rate');
const {Request} = require('../dao/request');


/**************************
 * RATE CONTROLLER
 * @param req
 * @param res
 * @param next
 */
exports.rateTourLeader = async (req, res, next) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.body.requestId);
		const tourLeaderId = await isIDGood(req.body.tourLeaderId);
		await Request.isRequestRated(requestId, userId);
		await Request.setRate(requestId);
		const response = await Rate.saveRate(req, tourLeaderId, userId);
		res.status(200).json(response);
	} catch (err) {
		next(err);
	}
};

