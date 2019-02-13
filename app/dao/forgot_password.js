const mongoose = require('mongoose');
const {forgotPasswordSchema} = require('../schemas/forgot_password');
const {buildErrObject} = require('../services/error_handler');

const uuid = require('uuid');
const {getIP, getCountry, getBrowserInfo} = require('../services/get_user_access');


/**************
 * STATICS
 */

//SAVE FORGOT PASSWORD
forgotPasswordSchema.statics.saveForgotPassword = async req => {
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
forgotPasswordSchema.statics.findForgotPassword = async verification => {
	return new Promise((resolve, reject) => {
		ForgotPassword.findOne(
			{
				verification: verification,
				used: false
			})
			.then(result => {
				if (!result)
					reject(buildErrObject('NOT_FOUND_OR_ALREADY_USED'));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


forgotPasswordSchema.statics.markResetPasswordAsUsed = async (req, forgotPass) => {
	return new Promise((resolve, reject) => {
		forgotPass.used = true;
		forgotPass.ipChanged = getIP(req);
		forgotPass.browserChanged = getBrowserInfo(req);
		forgotPass.countryChanged = getCountry(req);
		forgotPass.save((err, item) => {
			if (err) {
				reject(buildErrObject(422, err.message));
			}
			if (!item) {
				reject(buildErrObject(404, 'NOT_FOUND'));
			}
			resolve({
				msg: 'PASSWORD_CHANGED'
			});
		});
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