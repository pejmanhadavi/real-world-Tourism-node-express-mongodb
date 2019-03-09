const {isIDGood} = require('./base');

const Payir = require('payir');
const gateway = new Payir('test');

const {Request} = require('../dao/request');
const {TourLeader} = require('../dao/tour_leader');
const {Pay} = require('../dao/pay');

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
		const tourLeaderId = request.tourLeader;
		const costPerDay = await TourLeader.getTourLeaderCostPerDay(tourLeaderId);
		const maxDayOccupancy = request.maxDayOccupancy;
		const amount = costPerDay * maxDayOccupancy;
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
				await Pay.savePayment(data);
				res.status(200).json({
					msg: 'PAYMENT_WAS_SUCCESSFULLY'
				});
			});
	}  catch (err) {
		next(err);
	}
};