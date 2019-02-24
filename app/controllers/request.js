const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');

const {Request} = require('../dao/request');
const {TourLeader} = require('../dao/tour_leader');


/****************************
 * SEND REQUEST CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.sendRequest = async (req, res) => {
	try {
		const userId = await isIDGood(req.user._id);
		const tourLeaderId = await isIDGood(req.body.tourLeader);
		await TourLeader.tourLeaderCheckForRequest(tourLeaderId);
		const tourLeaderUserId = await TourLeader.getTourLeaderUserId(tourLeaderId);
		const response = await Request.saveRequest(req, userId, tourLeaderId, tourLeaderUserId);
		res.status(200).json(response);
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};

/***************************
 * TOUR LEADER FIRST VALIDATE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.tourLeaderFirstValidate = async (req, res) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		await TourLeader.tourLeaderDoesNotExists(userId);
		const tourLeaderId = await TourLeader.getTourLeaderId(userId);
		await Request.checkTourLeaderForRequest(requestId, tourLeaderId);
		const response = await Request.tourLeaderFirstValidate(requestId);
		res.status(200).json(response);
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};



/***************************
 * TOUR LEADER FINAL VALIDATE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.tourLeaderFinalValidate = async (req, res) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		await TourLeader.tourLeaderDoesNotExists(userId);
		const tourLeaderId = await TourLeader.getTourLeaderId(userId);
		await Request.checkTourLeaderForRequest(requestId, tourLeaderId);
		const response = await Request.tourLeaderFinalValidate(requestId);
		res.status(200).json(response);
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};

/******************************
 * USER FINAL VALIDATE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.userFinalValidate = async (req, res) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		const response = await Request.userFinalValidate(requestId, userId);
		res.status(200).json(response);
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};

/****************************
 * USER SATISFACTION CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.userSatisfaction = async (req, res) => {
	try {
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		const response = await Request.userSatisfaction(requestId, userId, req.body.satisfaction);
		res.status(200).json(response);
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};

/***********************************
 * TOUR LEADER SATISFACTION CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.tourLeaderSatisfaction = async (req, res) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		const tourLeaderId = await TourLeader.getTourLeaderId(userId);
		const response = await Request.tourLeaderSatisfaction(requestId, tourLeaderId, req.body.satisfaction);
		res.status(200).json(response);
	}catch (err) {
		console.log(err);
		handleError(res, buildErrObject(err.code, err.message));
	}
};