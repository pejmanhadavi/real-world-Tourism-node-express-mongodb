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
      //check if the user id is the request user
      //check if the user is the request tourLeader
      //save the message
      //response
  }  catch (err) {
      console.log(err);
      handleError(res, buildErrObject(err.code, err.messageSchema));
  }
};