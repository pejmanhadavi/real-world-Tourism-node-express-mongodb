const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');
const {TourLeader} = require('../dao/tour_leader');

/****************
 * REGISTER TOUR LEADER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.registerTourLeader = async (req, res) => {
	try{
		const id = await isIDGood(req.user._id);
		await TourLeader.tourLeaderExists(id);
		res.status(200).json(await TourLeader.registerTourLeader(req, id));
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};



exports.edit = async (req, res) => {
	try{
		const id = await isIDGood(req.user._id);
		await TourLeader.tourLeaderDoesNotExists(id);
		res.status(200).json(await TourLeader.edit(req, id));
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};