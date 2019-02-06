const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;
const {buildErrObject, handleError} = require('../services/error_handler');

exports.updateProfile = [
	check('username')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	check('currentpassword')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isLength({
			min: 5
		})
		.withMessage('PASSWORD_IS_TOO_SHORT_MIN_5'),
	check('newpassword')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isLength({
			min: 5
		})
		.withMessage('PASSWORD_IS_TOO_SHORT_MIN_5'),
	check('confirmnewpassword')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isLength({
			min: 5
		})
		.withMessage('PASSWORD_IS_TOO_SHORT_MIN_5'),
	check('phone')
		.optional()
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isMobilePhone()
		.withMessage('PHONE_IS_NOT_VALID'),
	(req, res, next)=>{
		try{
			//check password and confirm password
			if (req.body.currentpassword || req.body.newpassword || req.body.confirmnewpassword)
				if(req.body.newpassword !== req.body.confirmnewpassword)
					return handleError(res, buildErrObject(422, 'PASSWORD_AND_CONFIRM_PASSWORD_ARE_NOT_THE_SAME'));

			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];