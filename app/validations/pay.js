const {param, validationResult} = require('express-validator/check');
const {buildErrObject} = require('../services/error_handler');


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
			next(buildErrObject(422, err.array()[0].msg));
		}
	}
];