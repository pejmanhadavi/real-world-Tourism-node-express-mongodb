const {check, param}= require('express-validator/check');
const validationResult = require('express-validator/check').validationResult;
const {buildErrObject} = require('../services/error_handler');
const {auth_validation} = require('../../messages');

const validationErrCode = 400;

exports.register = [
	check('name')
		.exists()
		.withMessage(auth_validation.NAME_MISSING)
		.not()
		.isEmpty()
		.withMessage(auth_validation.NAME_IS_EMPTY),
	check('email')
		.exists()
		.withMessage(auth_validation.EMAIL_MISSING)
		.not()
		.isEmpty()
		.withMessage(auth_validation.EMAIL_IS_EMPTY)
		.isEmail()
		.withMessage(auth_validation.EMAIL_IS_NOT_VALID)
		.normalizeEmail(),
	check('password')
		.exists()
		.withMessage(auth_validation.PASSWORD_MISSING)
		.not()
		.isEmpty()
		.withMessage(auth_validation.PASSWORD_IS_EMPTY)
		.isLength({
			min: 5
		})
		.withMessage(auth_validation.PASSWORD_IS_TOO_SHORT_MIN_5),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];



exports.verify = [
	param('verification')
		.isUUID()
		.withMessage(auth_validation.VERIFICATION_BAD_REQUEST),
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];


exports.forgotPassword = [
	check('email')
		.exists()
		.withMessage(auth_validation.EMAIL_MISSING)
		.not()
		.isEmpty()
		.withMessage(auth_validation.EMAIL_IS_EMPTY)
		.isEmail()
		.withMessage(auth_validation.EMAIL_IS_NOT_VALID)
		.normalizeEmail(),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];


exports.getResetPassword = [
	param('verification')
		.isUUID()
		.withMessage(auth_validation.VERIFICATION_BAD_REQUEST),
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];
exports.postResetPassword = [
	param('verification')
		.isUUID()
		.withMessage(auth_validation.VERIFICATION_BAD_REQUEST),
	check('password')
		.exists()
		.withMessage(auth_validation.PASSWORD_MISSING)
		.not()
		.isEmpty()
		.withMessage(auth_validation.PASSWORD_IS_EMPTY)
		.isLength({
			min: 5
		})
		.withMessage(auth_validation.PASSWORD_IS_TOO_SHORT_MIN_5),
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];

exports.login = [
	check('email')
		.exists()
		.withMessage(auth_validation.EMAIL_MISSING)
		.not()
		.isEmpty()
		.withMessage(auth_validation.EMAIL_IS_EMPTY)
		.isEmail()
		.withMessage(auth_validation.EMAIL_IS_NOT_VALID)
		.normalizeEmail(),
	check('password')
		.exists()
		.withMessage(auth_validation.PASSWORD_MISSING)
		.not()
		.isEmpty()
		.withMessage(auth_validation.PASSWORD_IS_EMPTY)
		.isLength({
			min: 5
		})
		.withMessage(auth_validation.PASSWORD_IS_TOO_SHORT_MIN_5),
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];


exports.token = [
	check('refreshToken')
		.exists()
		.withMessage(auth_validation.REFRESH_TOKEN_MISSING)
		.not()
		.isEmpty()
		.withMessage(auth_validation.REFRESH_TOKEN_IS_EMPTY),
	//here we can add also is it uuid or not...
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];
