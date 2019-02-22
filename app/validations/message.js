const {check, param, validationResult} = require('express-validator/check');
const {buildErrObject, handleError} = require('../services/error_handler');


exports.sendMessage = [
    param('requestId')
        .exists()
        .withMessage('MISSING')
        .isMongoId()
        .withMessage('ID_IS_NOT_VALID'),
    check('body')
        .exists()
        .withMessage('MISSING')
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