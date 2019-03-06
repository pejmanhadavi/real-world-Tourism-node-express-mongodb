const {param, validationResult} = require('express-validator/check');
const {buildErrObject, handleError} = require('../services/error_handler');


exports.pay = [
	param('requestId')
		.exists()
		.withMessage('MISSING')
		.isMongoId()
		.withMessage('ID_IS_NOT_VALID'),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			return handleError(res, buildErrObject(422, err.array()));
		}
	}
];