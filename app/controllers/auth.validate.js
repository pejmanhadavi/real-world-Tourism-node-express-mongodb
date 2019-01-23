const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;
const {handleError, buildErrObject} = require('./base');


exports.register = [
    check('username')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY'),
    check('password')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isLength({
            min: 5
        })
        .withMessage('PASSWORD_IS_TOO_SHORT_MIN_5'),
    check('phone')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isMobilePhone()
        .withMessage('PHONE_IS_NOT_VALID'),
    (req, res, next)=>{
    try{
        validationResult(req).throw();
        return next();
    }catch(err){
        return handleError(res, buildErrObject(422, err.array()));
    }
}
];