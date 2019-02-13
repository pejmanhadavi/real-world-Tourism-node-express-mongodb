const {check, param}= require('express-validator/check');
const validationResult = require('express-validator/check').validationResult;
const {buildErrObject, handleError} = require('../services/error_handler');

exports.register = [
	check('name')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('email')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isEmail()
		.withMessage('EMAIL_IS_NOT_VALID')
		.normalizeEmail(),
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
	param('verification')
		.isUUID()
		.withMessage('BAD_REQUEST'),
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
	check('email')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isEmail()
		.withMessage('EMAIL_IS_NOT_VALID')
		.normalizeEmail(),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];


exports.getResetPassword = [
	param('verification')
		.isUUID()
		.withMessage('BAD_REQUEST'),
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];
exports.postResetPassword = [
	param('verification')
		.isUUID()
		.withMessage('BAD_REQUEST'),
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
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];

exports.login = [
	check('email')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isEmail()
		.withMessage('EMAIL_IS_NOT_VALID')
		.normalizeEmail(),
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