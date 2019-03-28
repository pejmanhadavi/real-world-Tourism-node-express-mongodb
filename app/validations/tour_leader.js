const {check, validationResult} = require('express-validator/check');
const {buildErrObject} = require('../services/error_handler');
const {leader_validation} = require('../../messages');

const validationErrCode = 400;

exports.edit = [
	check('experiences')
		.exists()
		.withMessage(leader_validation.EXPERIENCES_MISSING)
		.not()
		.isEmpty()
		.withMessage(leader_validation.EXPERIENCES_IS_EMPTY)
		.isArray()
		.withMessage(leader_validation.EXPERIENCES_MOST_BE_AN_ARRAY),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];
