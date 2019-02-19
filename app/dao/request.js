const mongoose = require('mongoose');

const {requestSchema} = require('../schemas/request');
const {buildErrObject} = require('../services/error_handler');


/*********************
 * STATICS
 ********************/
//SAVE REQUEST
requestSchema.statics.saveRequest = (req, userId, tourLeaderId) => {
	return new Promise((resolve, reject) => {
		const request = new Request({
			user: userId,
			tourLeader: tourLeaderId,
			maxDayOccupancy: req.body.maxDayOccupancy,
			maxHalfDayOccupancy: req.body.maxHalfDayOccupancy,
			description: req.body.description
		});
		request.save()
			.then(() => resolve({
				msg: 'REQUEST_SAVED'
			}))
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//IS TOUR LEADER FOR THIS REQUEST
requestSchema.statics.checkTourLeaderForRequest = (requestId, tourLeaderId) => {
	return new Promise((resolve, reject) => {
		Request.findOne({
			_id: requestId,
			tourLeader: tourLeaderId
		})
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'REQUEST_WITH_THIS_TOUR_LEADER_NOT_FOUND'));
				resolve(true);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//TOUR LEADER FIRST VALIDATE
requestSchema.statics.tourLeaderFirstValidate = requestId => {
	return new Promise((resolve, reject) => {
		Request.findById(requestId)
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				result.tourLeaderFirstValidate = true;
				await result.save();
				resolve({
					msg: 'TOUR_LEADER_FIRST_VALIDATE'
				});
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Request = mongoose.model('Request', requestSchema);
exports.Request = Request;