const mongoose = require('mongoose');
const {forgotPasswordSchema} = require('../schemas/forgot_password');
const {buildErrObject} = require('../services/error_handler');

const uuid = require('uuid');
const {getIP, getCountry, getBrowserInfo} = require('../services/get_user_access');
const {forgotPassword_dao} = require('../../messages');

/**************
 * STATICS
 */

//SAVE FORGOT PASSWORD
forgotPasswordSchema.statics.saveForgotPassword = req => {
	return new Promise((resolve, reject) => {
		const forgot = new ForgotPassword({
			email: req.body.email,
			verification: uuid.v4(),
			ipRequest: getIP(req),
			browserRequest: getBrowserInfo(req),
			countryRequest: getCountry(req)
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
					email: result.email
				});
			})
			.catch(err =>reject(buildErrObject(422, err.message)));
	});
};


forgotPasswordSchema.statics.deleteUnusedForgotPasswords = email => {
	return new Promise((resolve, reject) => {
		ForgotPassword.deleteMany({
			email: email,
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
