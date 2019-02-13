const {check, param} = require('express-validator/check');
const validationResult = require('express-validator/check').validationResult;
const {buildErrObject, handleError} = require('../services/error_handler');

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
	check('backgroundImage')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('profile')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('languages')
		.optional()
		.isArray(),
	check('iWillShowYou')
		.optional()
		.isArray(),
	check('travelFacilities')
		.optional()
		.isArray(),
	check('currentPassword')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isLength({
			min: 5
		})
		.withMessage('PASSWORD_IS_TOO_SHORT_MIN_5'),
	check('newPassword')
		.optional()
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

exports.deleteProfileImage = [
	param('profile')
		.exists()
		.withMessage('MISSING'),
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];