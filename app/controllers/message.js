const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');

const {Message} = require('../dao/message');
const {TourLeader} = require('../dao/tour_leader');
const {Request} = require('../dao/request');

/**********************************
 * SEND MESSAGE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.sendMessage = async (req, res) => {
  try {
      const userId = await isIDGood(req.user._id);
      const requestId = await isIDGood(req.params.requestId);
      //find the request
      await Request.requestExists(requestId);
      //check if the user id is the request user or is the tourLeader
      const doesRequestExistsWithUserId = await Request.findRequestByUserId(requestId, userId);
      if (!doesRequestExistsWithUserId){
          const tourLeaderId = await TourLeader.getTourLeaderId(userId);
          await Request.findRequestByTourLeaderId(requestId, tourLeaderId);
      }
      //save the message
      const response = await Message.saveMessage(requestId, userId, req.body.body);
      //response
      res.status(200).json(response);
  }  catch (err) {
      handleError(res, buildErrObject(err.code, err.message));
  }
};