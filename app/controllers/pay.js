const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');

const Payir = require('payir');
const gateway = new Payir('test');

const {Request} = require('../dao/request');
const {TourLeader} = require('../dao/tour_leader');

/*****************************
 * PAY CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.pay = async (req, res) => {
  try{
      const userId = await isIDGood(req.user._id);
      const requestId = await isIDGood(req.params.requestId);
      const request = await Request.findRequestForPay(requestId, userId);
      const tourLeaderId = request.tourLeader;
      const costPerDay = await TourLeader.getTourLeaderCostPerDay(tourLeaderId);
      const maxDayOccupancy = request.maxDayOccupancy;
      const amount = costPerDay * maxDayOccupancy;
      const link = await gateway.send(amount, 'http:/127.0.0.1:3000/pay/verify', request.factorNumber);
      res.redirect(link);
  } catch(err) {
      console.log(err);
      handleError(res, buildErrObject(err.code, err.message));
  }
};


exports.verifyPay = async (req, res) => {
  try{
      gateway.verify(req.body)
          .then(data => {
              console.log(typeof data.factorNumber);
              console.log(typeof data.transactionId);
              console.log(typeof data.amount);
              console.log(typeof data.cardNumber);
              res.end('Payment was successful.')})
          .catch(error => res.end("<head><meta charset='utf8'></head>" + error));
  }  catch (err) {
      console.log(err);
      handleError(res, buildErrObject(err.code, err.message));
  }
};