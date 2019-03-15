const {isIDGood} = require('./base');

const {Request} = require('../dao/request');
const {TourLeader} = require('../dao/tour_leader');
const {handleResponse} = require('../services/response_handler');


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
		const tourLeaderUserId = await TourLeader.getTourLeaderUserId(tourLeaderId);
		const response = await Request.saveRequest(req, userId, tourLeaderId, tourLeaderUserId);
		handleResponse(res, 200, 'REQUEST_SENT', response);
	}catch (err) {
		next(err);
	}
};

/***************************
 * TOUR LEADER FIRST VALIDATE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.tourLeaderFirstValidate = async (req, res, next) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		await TourLeader.tourLeaderDoesNotExists(userId);
		const tourLeaderId = await TourLeader.getTourLeaderId(userId);
		await Request.checkTourLeaderForRequest(requestId, tourLeaderId);
		const response = await Request.tourLeaderFirstValidate(requestId);
		handleResponse(res, 200, 'TOUR_LEADER_FIRST_VALIDATE', response);
	}catch (err) {
		next(err);
	}
};



/***************************
 * TOUR LEADER FINAL VALIDATE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.tourLeaderFinalValidate = async (req, res, next) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		await TourLeader.tourLeaderDoesNotExists(userId);
		const tourLeaderId = await TourLeader.getTourLeaderId(userId);
		await Request.checkTourLeaderForRequest(requestId, tourLeaderId);
		const response = await Request.tourLeaderFinalValidate(requestId);
		handleResponse(res, 200, 'TOUR_LEADER_FINAL_VALIDATE', response);
	}catch (err) {
		next(err);
	}
};

/******************************
 * USER FINAL VALIDATE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.userFinalValidate = async (req, res, next) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		const response = await Request.userFinalValidate(requestId, userId);
		handleResponse(res, 200, 'USER_FINAL_VALIDATE', response);
	}catch (err) {
		next(err);
	}
};

/****************************
 * USER SATISFACTION CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.userSatisfaction = async (req, res, next) => {
	try {
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		const response = await Request.userSatisfaction(requestId, userId, req.body.satisfaction);
		handleResponse(res, 200, 'USER_SATISFACTION', response);
	}catch (err) {
		next(err);
	}
};

/***********************************
 * TOUR LEADER SATISFACTION CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.tourLeaderSatisfaction = async (req, res, next) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		const tourLeaderId = await TourLeader.getTourLeaderId(userId);
		const response = await Request.tourLeaderSatisfaction(requestId, tourLeaderId, req.body.satisfaction);
		handleResponse(res, 200, 'TOUR_LEADER_SATISFACTION', response);
	}catch (err) {
		next(err);
	}
};