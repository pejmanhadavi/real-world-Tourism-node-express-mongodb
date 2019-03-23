const mongoose = require('mongoose');

const {requestSchema} = require('../schemas/request');
const {buildErrObject} = require('../services/error_handler');


/*********************
 * STATICS
 ********************/
//SAVE REQUEST
requestSchema.statics.saveRequest = (req, userId, tourLeaderId, tourLeaderUserId) => {
	return new Promise((resolve, reject) => {
		const request = new Request({
			user: userId,
			tourLeader: tourLeaderId,
			tourLeaderUserId: tourLeaderUserId,
			experiences: req.body.experiences
		});
		request.save()
			.then(result => resolve({
				id: result._id,
				user: userId,
				tourLeader: tourLeaderId
			}))
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};
//CHECK IF THE REQUEST EXISTS
requestSchema.statics.requestExists = (requestId) => {
	return new Promise((resolve, reject) => {
		Request.findById(requestId)
			.then(resolve)
			.catch(err => reject(buildErrObject(422, err.messageSchema)));
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
					id: result._id,
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
					id: result._id
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
					id: result._id
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
			user: userId,
			tourLeaderFirstValidate: true,
			tourLeaderFinalValidate: true,
			userFinalValidate: true
		})
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				if (result.userSatisfaction)
					reject(buildErrObject(409, 'ALREADY_EXISTS'));
				result.userSatisfaction = satisfaction;
				await result.save();
				resolve({
					id: result._id
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
			tourLeader: tourLeaderId,
			tourLeaderFirstValidate: true,
			tourLeaderFinalValidate: true,
			userFinalValidate: true
		})
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				if (result.tourLeaderSatisfaction)
					reject(buildErrObject(409, 'ALREADY_EXISTS'));
				result.tourLeaderSatisfaction= satisfaction;
				await result.save();
				resolve({
					id: result._id
				});
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//FIND REQUEST BY USER ID
requestSchema.statics.findRequestByUserId = (requestId, userId) => {
	return new Promise((resolve, reject) => {
		Request.findOne({
			_id: requestId,
			user: userId
		})
			.then(result => {
				if (!result)
					resolve(false);
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//FIND REQUEST BY TOUR LEADER ID
requestSchema.statics.findRequestByTourLeaderId = (requestId, tourLeaderId) => {
	return new Promise((resolve, reject) => {
		Request.findOne({
			_id: requestId,
			tourLeader: tourLeaderId
		})
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				resolve(true);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//GET REQUEST BY ID
requestSchema.statics.getRequestById = id => {
	return new Promise((resolve, reject) => {
		Request.findById(id)
			.then(result => {
				if(!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//IS REQUEST RATED
requestSchema.statics.isRequestRated = (requestId, userId) => {
	return new Promise((resolve, reject) => {
		Request.findOne({
			_id: requestId,
			user: userId,
			tourLeaderFirstValidate: true,
			userFinalValidate: true,
			tourLeaderFinalValidate: true,
			paid: true,
			// userSatisfaction: true,
			// tourLeaderSatisfaction: true,
			rated: false
		})
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND_OR_RATED'));
				resolve(true);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//SET RATE  TO TRUE
requestSchema.statics.setRate = requestId => {
	return new Promise((resolve, reject) => {
		Request.findById(requestId)
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				result.rated= true;
				await result.save();
				resolve({
					id: result._id
				});
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//FIND REQUEST FOR PAY
requestSchema.statics.findRequestForPay = (requestId, userId) => {
	return new Promise((resolve, reject) => {
		Request.findOne({
			_id: requestId,
			user: userId,
			tourLeaderFirstValidate: true,
			userFinalValidate: true,
			tourLeaderFinalValidate: true,
			paid: false
		})
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND_OR_PAID'));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


//FIND REQUEST BY FACTOR NUMBER
requestSchema.statics.findRequestByFactorNumber = factorNumber => {
	return new Promise((resolve, reject) => {
		Request.findOne({
			factorNumber: factorNumber,
			paid: false
		})
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Request = mongoose.model('Request', requestSchema);
exports.Request = Request;