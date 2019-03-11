const {check, validationResult} = require('express-validator/check');
const {buildErrObject, handleError} = require('../services/error_handler');

exports.registerTourLeader = [
	check('costPerDay')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('costPerHalfDay')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];



exports.edit = [
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