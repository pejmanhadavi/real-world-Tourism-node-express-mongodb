const {check, validationResult} = require('express-validator/check');
const {buildErrObject} = require('../services/error_handler');
const {rate_validation} = require('../../messages');

const validationErrCode = 400;

exports.rateTourLeader = [
	check('tourLeaderId')
		.exists()
		.withMessage(rate_validation.LEADER_ID_MISSING)
		.not()
		.isEmpty()
		.withMessage(rate_validation.LEADER_ID_IS_EMPTY)
		.isMongoId()
		.withMessage(rate_validation.LEADER_ID_IS_NOT_VALID),
	check('star')
		.optional()
		.not()
		.isEmpty()
		.withMessage(rate_validation.STAR_IS_EMPTY)
		.isNumeric()
		.withMessage(rate_validation.STAR_SHOULD_BE_NUMERIC),
	check('comment')
		.optional()
		.not()
		.isEmpty()
		.withMessage(rate_validation.COMMENT_IS_EMPTY),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];
