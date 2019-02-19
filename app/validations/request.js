const {check, param, validationResult} = require('express-validator/check');
const {buildErrObject, handleError} = require('../services/error_handler');

exports.sendRequest = [
    check('tourLeader')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isMongoId()
        .withMessage('ID_IS_NOT_VALID'),
    check('maxDayOccupancy')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isNumeric()
        .withMessage('IS_NOT_NUMBERIC'),
    check('maxHalfDayOccupancy')
        .exists()
        .withMessage('MISSING')
        .not()
        .isEmpty()
        .withMessage('IS_EMPTY')
        .isNumeric()
        .withMessage('IS_NOT_NUMBERIC'),
    check('description')
        .optional()
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



exports.tourLeaderFirstValidate = [
    param('requestId')
        .exists()
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