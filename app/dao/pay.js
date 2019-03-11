const mongoose = require('mongoose');

const {paySchema} = require('../schemas/pay');
const {buildErrObject} = require('../services/error_handler');


/*********************
 * STATICS
 ********************/
//SAVE PAYMENT
paySchema.statics.savePayment = data => {
	return new Promise((resolve, reject) => {
		const pay = new Pay({
			factorNumber: data.factorNumber,
			transactionId: data.transactionId,
			amount: data.amount,
			cardNumber: data.cardNumber
		});
		pay.save()
			.then(result => resolve({
				id: result._id,
				transactionId: result.transactionId,
				factorNumber: result.factorNumber,
				amount: result.amount
			}))
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};



/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Pay = mongoose.model('Pay', paySchema);
exports.Pay = Pay;