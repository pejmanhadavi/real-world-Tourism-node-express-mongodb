const {isIDGood} = require('./base');

const Payir = require('payir');
const gateway = new Payir('test');

const {Request} = require('../dao/request');
const {Pay} = require('../dao/pay');
const {handleResponse} = require('../services/response_handler');
const {Experience} = require('../dao/experience');
const {pay_controller} = require('../../messages');
/*****************************
 * PAY CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.pay = async (req, res, next) => {
	try{
		const userId = await isIDGood(req.user._id);
		const requestId = await isIDGood(req.params.requestId);
		const request = await Request.findRequestForPay(requestId, userId);
		const experiences = request.experiences;
		const amount = await Experience.calculateAmount(experiences);
		console.log(amount);
		const link = await gateway.send(amount, 'http:/127.0.0.1:3000/pay/verify', request.factorNumber);
		res.redirect(link);
	} catch(err) {
		next(err);
	}
};

/*****************************
 * VERIFY PAY
 * @param req
 * @param res
 * @param next
 */
exports.verifyPay = (req, res, next) => {
	try{
		gateway.verify(req.body)
			.then(async data => {
				const request = await Request.findRequestByFactorNumber(data.factorNumber);
				request.paid = true;
				await request.save();
				const response = await Pay.savePayment(data);
				handleResponse(res, 200, pay_controller.SUCCESS_FULL_PAYMENT, response);
			});
	}  catch (err) {
		next(err);
	}
};
