const mongoose = require('mongoose');

const {rateSchema} = require('../schemas/rate');
const {buildErrObject} = require('../services/error_handler');

/*********************
 * STATICS
 ********************/
rateSchema.statics.saveRate = (req, tourLeaderId, userId) => {
	return new Promise((resolve, reject) => {
		const rate = new Rate({
			tourLeader: tourLeaderId,
			user: userId,
			comment: req.body.comment,
			star: req.body.star
		});
		rate.save()
			.then(result => {
				resolve({
					id: result._id,
				});
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};



//NUMBER OF RATES
rateSchema.statics.numberOfRates= () => {
	return new Promise((resolve, reject) => {
		Rate.find({})
			.then(result => {
				const countOfRates = result.length;
				resolve(countOfRates);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};



/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Rate = mongoose.model('Rate', rateSchema);
exports.Rate = Rate;
