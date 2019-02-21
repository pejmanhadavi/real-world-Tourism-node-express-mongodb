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
			.then(result => resolve({
				msg: 'REQUEST_SAVED',
				id: result._id
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

//TOUR LEADER FINAL VALIDATE
requestSchema.statics.tourLeaderFinalValidate = requestId => {
	return new Promise((resolve, reject) => {
		Request.findById(requestId)
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				result.tourLeaderFinalValidate = true;
				await result.save();
				resolve({
					msg: 'TOUR_LEADER_FINAL_VALIDATE'
				});
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//USER FINAL VALIDATE
requestSchema.statics.userFinalValidate = (requestId, userId) => {
	return new Promise((resolve, reject) => {
		Request.findOne({
			_id: requestId,
			user: userId
		})
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				result.userFinalValidate = true;
				await result.save();
				resolve({
					msg: 'USER_FINAL_VALIDATE'
				});
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


//USER SATISFACTION
requestSchema.statics.userSatisfaction= (requestId, userId, satisfaction) => {
	return new Promise((resolve, reject) => {
		Request.findOne({
			_id: requestId,
			user: userId
		})
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				if (result.userSatisfaction)
					reject(buildErrObject(409, 'ALREADY_EXISTS'));
				result.userSatisfaction = satisfaction;
				await result.save();
				resolve({
					msg: 'USER_SATISFACTION'
				});
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


//TOUR LEADER SATISFACTION
requestSchema.statics.tourLeaderSatisfaction= (requestId, tourLeaderId, satisfaction) => {
	return new Promise((resolve, reject) => {
		Request.findOne({
			_id: requestId,
			tourLeader: tourLeaderId
		})
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				if (result.tourLeaderSatisfaction)
					reject(buildErrObject(409, 'ALREADY_EXISTS'));
				result.tourLeaderSatisfaction= satisfaction;
				await result.save();
				resolve({
					msg: 'TOUR_LEADER_SATISFACTION'
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