const {check, body} = require('express-validator/check');
const validationResult = require('express-validator/check').validationResult;
const {buildErrObject, handleError} = require('../services/error_handler');

exports.updateProfile = [
	check('username')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
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
			if (req.body.currentpassword)
				if (val !== req.body.confirmNewPassword)
					throw new Error('NEW_PASSWORD_AND_CONFIRM_NEW_PASSWORD_ARE_NOT_THE_SAME');
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