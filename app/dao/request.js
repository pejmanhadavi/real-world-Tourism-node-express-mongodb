const mongoose = require('mongoose');

const {requestSchema} = require('../schemas/request');
const {buildErrObject} = require('../services/error_handler');
const {request_dao} = require('../../messages');

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
					reject(buildErrObject(404, request_dao.REQUEST_WITH_TOUR_LEADER_NOT_FOUND));
				resolve(true);
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
					reject(buildErrObject(404, request_dao.REQUEST_NOT_FOUND));
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
					reject(buildErrObject(404, request_dao.REQUEST_NOT_FOUND));
				resolve(result);
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
					reject(buildErrObject(404, request_dao.NOT_FOUND_OR_PAID));
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
					reject(buildErrObject(404, request_dao.REQUEST_NOT_FOUND));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


//NUMBER OF REQUESTS
requestSchema.statics.numberOfRequests= () => {
	return new Promise((resolve, reject) => {
		Request.find({})
			.then(result => {
				const countOfUsers = result.length;
				resolve(countOfUsers);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Request = mongoose.model('Request', requestSchema);
exports.Request = Request;
