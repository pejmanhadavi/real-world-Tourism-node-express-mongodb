const mongoose = require('mongoose');
const {forgotPasswordSchema} = require('../schemas/forgot_password');
const {buildErrObject} = require('../services/error_handler');
const dateFns = require('date-fns');
const uuid = require('uuid');
const {getIP, getCountry, getBrowserInfo} = require('../services/get_user_access');
const {forgotPassword_dao} = require('../../messages');
const generateCode = require('generate-sms-verification-code');

const MINUTES_TO_VERIFY = 5;
/**************
 * STATICS
 */

//SAVE FORGOT PASSWORD
forgotPasswordSchema.statics.saveForgotPassword = req => {
	return new Promise((resolve, reject) => {
		const forgot = new ForgotPassword({
			phone: req.body.phone,
			verification: generateCode(6),
			ipRequest: getIP(req),
			browserRequest: getBrowserInfo(req),
			countryRequest: getCountry(req),
			expires: dateFns.addMinutes(new Date(), MINUTES_TO_VERIFY)
		});

		forgot.save()
			.then(result => resolve(result))
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//FIND FORGOT PASSWORD
forgotPasswordSchema.statics.findForgotPassword = verification => {
	return new Promise((resolve, reject) => {
		ForgotPassword.findOne(
			{
				verification: verification,
				used: false
			})
			.then(result => {
				if (!result)
					reject(buildErrObject(404,forgotPassword_dao.NOT_FOUND_OR_ALREADY_USED));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//GET FORGOT PASSWORD
forgotPasswordSchema.statics.firstGetForgotPassword = (data) => {
	return new Promise((resolve, reject) => {
		ForgotPassword.findOne(
			{
				phone: data.phone,
				verification: data.phoneVerification,
				used: false,
				finalUsed: false,
				expires : {$gt: Date.now()}
			})
			.then(result => {
				if (!result)
					reject(buildErrObject(404,forgotPassword_dao.NOT_FOUND_OR_ALREADY_USED));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//GET FORGOT PASSWORD
forgotPasswordSchema.statics.finalGetForgotPassword = (user) => {
	return new Promise((resolve, reject) => {
		ForgotPassword.findOne(
			{
				phone: user.phone,
				used: true,
				finalUsed: false,
			})
			.then(result => {
				if (!result)
					reject(buildErrObject(404,forgotPassword_dao.NOT_FOUND_OR_ALREADY_USED));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


forgotPasswordSchema.statics.markResetPasswordAsUsed = (req, forgotPass) => {
	return new Promise((resolve, reject) => {
		forgotPass.used = true;
		forgotPass.ipChanged = getIP(req);
		forgotPass.browserChanged = getBrowserInfo(req);
		forgotPass.countryChanged = getCountry(req);
		forgotPass.save()
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, forgotPassword_dao.FORGOT_PASSWORD_NOT_FOUND));
				resolve({
					phone: result.phone
				});
			})
			.catch(err =>reject(buildErrObject(422, err.message)));
	});
};

//MARK FINAL USED
forgotPasswordSchema.statics.markResetPasswordAsFinalUsed = (req, forgotPass) => {
	return new Promise((resolve, reject) => {
		forgotPass.finalUsed = true;
		forgotPass.save()
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, forgotPassword_dao.FORGOT_PASSWORD_NOT_FOUND));
				resolve({
					phone: result.phone
				});
			})
			.catch(err =>reject(buildErrObject(422, err.message)));
	});
};


forgotPasswordSchema.statics.deleteUnusedForgotPasswords = phone => {
	return new Promise((resolve, reject) => {
		ForgotPassword.deleteMany({
			phone,
			used: false
		})
			.then(result => {
				if (!result)
					reject(buildErrObject(404 , forgotPassword_dao.NOT_FOUND));
				resolve(true);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};
/**************
 * HELPERS
 */

exports.forgotPasswordResponse = () => {
	return {
		msg: 'RESET_EMAIL_SENT'
	};
};

/**************
 *CREATE AND EXPORT MODEL
 */
const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

exports.ForgotPassword = ForgotPassword;
