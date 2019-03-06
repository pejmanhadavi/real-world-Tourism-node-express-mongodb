const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');

const {Rate} = require('../dao/rate');
const {Request} = require('../dao/request');


/**************************
 * RATE CONTROLLER
 * @param req
 * @param res
 */
exports.rateTourLeader = async (req, res) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.body.requestId);
		const tourLeaderId = await isIDGood(req.body.tourLeaderId);
		await Request.isRequestRated(requestId, userId);
		await Request.setRate(requestId);
		const response = await Rate.saveRate(req, tourLeaderId, userId);
		res.status(200).json(response);
	} catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};

