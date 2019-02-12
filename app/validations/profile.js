const {check, body} = require('express-validator/check');
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
	check('profileImages')
		.optional()
		.isArray()
		.custom(value => {
			return value.length<6;
		})
		.withMessage('MOST_BE_AT_MOST_5'),
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
	check('confirmNewPassword')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	body('newPassword')
		.custom((val, {req}) => {
			if (req.body.currentPassword){
				if (val !== req.body.confirmNewPassword)
					throw new Error('NEW_PASSWORD_AND_CONFIRM_NEW_PASSWORD_ARE_NOT_THE_SAME');
			}else
				throw new Error('CURRENT_PASSWORD_MISSING');

			return true;
		}),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];