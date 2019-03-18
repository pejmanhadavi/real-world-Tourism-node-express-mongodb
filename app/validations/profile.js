const {check, param, validationResult} = require('express-validator/check');
const {buildErrObject} = require('../services/error_handler');

const validationErrCode = 400;

exports.updateProfile = [
	check('name')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('phone')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isMobilePhone()
		.withMessage('INVALID_PHONE'),
	check('city')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('province')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('aboutMe')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isLength({
			max: 500
		}),
	check('motto')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isLength({
			max: 300
		}),
	check('languages')
		.optional()
		.isArray(),
	check('iWillShowYou')
		.optional()
		.isArray(),
	check('travelFacilities')
		.optional()
		.isArray(),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];


exports.updatePassword = [

	check('currentPassword')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isLength({
			min: 5
		})
		.withMessage('PASSWORD_IS_TOO_SHORT_MIN_5'),
	check('newPassword')
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
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];


exports.deleteProfileImage = [
	param('profile')
		.exists()
		.withMessage('MISSING'),
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];