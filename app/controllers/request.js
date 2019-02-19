const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');

const {Request} = require('../dao/request');
const {User} = require('../dao/user');
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
      const response = await Request.saveRequest(req, userId, tourLeaderId);
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
      //is user a tour leader
      //is tour leader for this request
      //set the first validate to true and save it
  }catch (err) {
      handleError(res, buildErrObject(err.code, err.message));
  }
};