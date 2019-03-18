const {check, validationResult} = require('express-validator/check');
const {buildErrObject} = require('../services/error_handler');

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
			next(buildErrObject(422, err.array()[0].msg));
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
			next(buildErrObject(422, err.array()[0].msg));
		}
	}
];