const {isIDGood} = require('./base');
const {TourLeader} = require('../dao/tour_leader');

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
		res.status(200).json(await TourLeader.registerTourLeader(req, id));
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
		res.status(200).json(await TourLeader.edit(req, id));
	}catch (err) {
		next(err);
	}
};