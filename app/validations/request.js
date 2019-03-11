const {check, param, validationResult} = require('express-validator/check');
const {buildErrObject, handleError} = require('../services/error_handler');

exports.sendRequest = [
	check('tourLeader')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isMongoId()
		.withMessage('ID_IS_NOT_VALID'),
	check('experiences')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isArray()
		.withMessage('MOST_BE_ARRAY'),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];



exports.tourLeaderValidate = [
	param('requestId')
		.exists()
		.withMessage('MISSING')
		.isMongoId()
		.withMessage('ID_IS_NOT_VALID'),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];





exports.satisfaction = [
	param('requestId')
		.exists()
		.withMessage('MISSING')
		.isMongoId()
		.withMessage('ID_IS_NOT_VALID'),
	check('satisfaction')
		.exists()
		.withMessage('MISSING')
		.isBoolean()
		.withMessage('MALFORMED'),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];