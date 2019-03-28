const {param, validationResult} = require('express-validator/check');
const {buildErrObject} = require('../services/error_handler');
const {request_validation} = require('../../messages');

const validationErrCode = 400;

exports.pay = [
	param('requestId')
		.exists()
		.withMessage(request_validation.REQUEST_ID_MISSING)
		.isMongoId()
		.withMessage(request_validation.REQUEST_ID_IS_NOT_VALID),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];
