const {param, validationResult} = require('express-validator/check');
const {buildErrObject} = require('../services/error_handler');

const validationErrCode = 400;

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
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];