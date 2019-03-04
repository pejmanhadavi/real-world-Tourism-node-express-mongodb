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
      console.log(amount);
      const link = await gateway.send(amount, 'http:/127.0.0.1:3000/request/pay/verify');
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
              console.log(data.factorNumber);
              console.log(data.transactionId);
              console.log(data.amount);
              console.log(data.cardNumber);
              res.end('Payment was successful.')})
          .catch(error => res.end("<head><meta charset='utf8'></head>" + error));
  }  catch (err) {
      console.log(err);
      handleError(res, buildErrObject(err.code, err.message));
  }
};