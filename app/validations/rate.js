const {check, validationResult} = require('express-validator/check');
const {buildErrObject, handleError} = require('../services/error_handler');


exports.rateTourLeader = [
	check('tourLeaderId')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isMongoId()
		.withMessage('ID_IS_NOT_VALID'),
	check('requestId')
		.exists()
		.withMessage('MISSING')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isMongoId()
		.withMessage('ID_IS_NOT_VALID'),
	check('star')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY')
		.isNumeric()
		.withMessage('SHOULD_BE_NUMBERIC'),
	check('comment')
		.not()
		.isEmpty()
		.withMessage('IS_EMPTY'),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];