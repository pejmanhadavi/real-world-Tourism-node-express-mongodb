const {check, validationResult} = require('express-validator/check');
const validator = require('express-validator');
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
	check('costPerDay')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('costPerHalfDay')
		.optional()
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