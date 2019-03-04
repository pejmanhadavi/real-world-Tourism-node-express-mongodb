const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');

const Payir = require('payir');
const gateway = new Payir('test');

/*****************************
 * PAY CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.pay = async (req, res) => {
  try{

      gateway.send(1000, 'http:/127.0.0.1:3000/request/pay/verify', '65412311')
          .then(link => res.redirect(link))
          .catch(error => res.end("<head><meta charset='utf8'></head>" + error));

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