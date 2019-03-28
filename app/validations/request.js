const {check, param, validationResult} = require('express-validator/check');
const {buildErrObject} = require('../services/error_handler');
const {request_validation} = require('../../messages');

const validationErrCode = 400;

exports.sendRequest = [
	check('tourLeader')
		.exists()
		.withMessage(request_validation.LEADER_ID_MISSING)
		.not()
		.isEmpty()
		.withMessage(request_validation.LEADER_ID_IS_EMPTY)
		.isMongoId()
		.withMessage(request_validation.LEADER_ID_IS_NOT_VALID),
	check('experiences')
		.exists()
		.withMessage(request_validation.EXPERIENCES_MISSING)
		.not()
		.isEmpty()
		.withMessage(request_validation.EXPERIENCES_IS_EMPTY)
		.isArray()
		.withMessage(request_validation.EXPERIENCES_MOST_BE_AN_ARRAY),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];



exports.tourLeaderValidate = [
	param('requestId')
		.exists()
		.withMessage(request_validation.REQUEST_ID_MISSING)
		.isMongoId()
		.withMessage(request_validation.REQUEST_ID_IS_NOT_VALID),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];





exports.satisfaction = [
	param('requestId')
		.exists()
		.withMessage(request_validation.REQUEST_ID_MISSING)
		.isMongoId()
		.withMessage(request_validation.REQUEST_ID_IS_NOT_VALID),
	check('satisfaction')
		.exists()
		.withMessage(request_validation.SATISFACTION_MISSING)
		.isBoolean()
		.withMessage(request_validation.SATISFACTION_MALFORMED),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];
