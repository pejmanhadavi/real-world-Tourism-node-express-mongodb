const {check, body}= require('express-validator/check');
const validationResult = require('express-validator/check').validationResult;
const {buildErrObject, handleError} = require('../services/error_handler');

exports.register = [
	check('username')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('password')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isLength({
			min: 5
		})
		.withMessage('PASSWORD_IS_TOO_SHORT_MIN_5'),
	body('password')
		.custom((val, {req}) => {
			if (val !== req.body.confirmpassword)
				throw new Error('PASSWORD_AND_CONFIRM_PASSWORD_ARE_NOT_THE_SAME');
			return true;
		}),
	check('phone')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isMobilePhone()
		.withMessage('PHONE_IS_NOT_VALID'),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];



exports.verify = [
	check('id')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('verification')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];


exports.forgotPassword = [
	check('phone')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isMobilePhone()
		.withMessage('PHONE_IS_NOT_VALID'),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];

exports.login = [
	check('phone')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isMobilePhone()
		.withMessage('PHONE_IS_NOT_VALID'),
	check('password')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isLength({
			min: 5
		})
		.withMessage('PASSWORD_TOO_SHORT_MIN_5'),
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];