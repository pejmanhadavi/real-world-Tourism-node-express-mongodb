const {check, param, validationResult} = require('express-validator/check');
const {buildErrObject} = require('../services/error_handler');
const {profile_vlidation} = require('../../messages');

const validationErrCode = 400;

exports.updateProfile = [
	check('name')
		.optional()
		.not()
		.isEmpty()
		.withMessage(profile_vlidation.NAME_IS_EMPTY),
	check('phone')
		.optional()
		.not()
		.isEmpty()
		.withMessage(profile_vlidation.PHONE_IS_EMPTY)
		.isMobilePhone()
		.withMessage(profile_vlidation.INVALID_PHONE),
	check('city')
		.optional()
		.not()
		.isEmpty()
		.withMessage(profile_vlidation.CITY_IS_EMPTY),
	check('province')
		.optional()
		.not()
		.isEmpty()
		.withMessage(profile_vlidation.PROVINCE_IS_EMPTY),
	check('aboutMe')
		.optional()
		.not()
		.isEmpty()
		.withMessage(profile_vlidation.ABOUT_ME_IS_EMPTY)
		.isLength({
			max: 500
		})
		.withMessage(profile_vlidation.ABOUT_ME_LENGTH),
	check('motto')
		.optional()
		.not()
		.isEmpty()
		.withMessage(profile_vlidation.MOTTO_IS_EMPTY)
		.isLength({
			max: 300
		})
		.withMessage(profile_vlidation.MOTTO_LENGTH),
	check('languages')
		.optional()
		.isArray()
		.withMessage(profile_vlidation.LANGUAGES_MOST_BE_AN_ARRAY),
	check('iWillShowYou')
		.optional()
		.isArray()
		.withMessage(profile_vlidation.I_WILL_SHOW_YOU_MOST_BE_AN_ARRAY),
	check('travelFacilities')
		.optional()
		.isArray()
		.withMessage(profile_vlidation.TRAVEL_FACILITIES_MOST_BE_AN_ARRAY),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];


exports.updatePassword = [

	check('currentPassword')
		.exists()
		.withMessage(profile_vlidation.CURRENT_PASSWORD_MISSING)
		.not()
		.isEmpty()
		.withMessage(profile_vlidation.CURRENT_PASSWORD_IS_EMPTY)
		.isLength({
			min: 5
		})
		.withMessage(profile_vlidation.CURRENT_PASSWORD_IS_TOO_SHORT_MIN_5),
	check('newPassword')
		.exists()
		.withMessage(profile_vlidation.NEW_PASSWORD_MISSING)
		.not()
		.isEmpty()
		.withMessage(profile_vlidation.NEW_PASSWORD_IS_EMPTY)
		.isLength({
			min: 5
		})
		.withMessage(profile_vlidation.NEW_PASSWORD_IS_TOO_SHORT_MIN_5),
	(req, res, next)=>{
		try{
			validationResult(req).throw();
			return next();
		}catch(err){
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];


exports.deleteProfileImage = [
	param('profile')
		.exists()
		.withMessage(profile_vlidation.PROFILE_IMAGE_MISSING),
	(req, res, next) => {
		try {
			validationResult(req).throw();
			return next();
		} catch (err) {
			next(buildErrObject(validationErrCode, err.array()[0].msg));
		}
	}
];
