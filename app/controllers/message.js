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
      await Request.requestExists(requestId);
      const doesRequestExistsWithUserId = await Request.findRequestByUserId(requestId, userId);
      if (!doesRequestExistsWithUserId){
          const tourLeaderId = await TourLeader.getTourLeaderId(userId);
          await Request.findRequestByTourLeaderId(requestId, tourLeaderId);
      }
      const response = await Message.saveMessage(requestId, userId, req.body.body);
      res.status(200).json(response);
  }  catch (err) {
      handleError(res, buildErrObject(err.code, err.message));
  }
};

/***************************
 * READ MESSAGE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.readMessage = async (req, res) => {
    try {
        const messageId = await isIDGood(req.params.messageId);
        const userId = await isIDGood(req.user._id);
        const message = await Message.getMessageById(messageId);
        const request = await Request.getRequestById(message.requestId);
        await Message.checkMessageAuthor(messageId, userId);
        const doesRequestExistsWithUserId = await Request.findRequestByUserId(request._id, userId);
        if (!doesRequestExistsWithUserId){
            const tourLeaderId = await TourLeader.getTourLeaderId(userId);
            await Request.findRequestByTourLeaderId(requestId, tourLeaderId);
        }
        const response = await Message.updateMessageToRead(messageId);
        res.status(200).json(response);
    }catch (err) {
        handleError(res, buildErrObject(err.code, err.message));
    }
};