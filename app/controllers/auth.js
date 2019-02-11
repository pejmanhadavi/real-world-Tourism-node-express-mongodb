const matchedData = require('express-validator/filter').matchedData;

const {User, saveLoginAttemptsToDB} = require('../dao/user');
const {ForgotPassword, forgotPasswordResponse} = require('../dao/forgot_password');
const {buildErrObject, handleError} = require('../services/error_handler');
const {sendVerificationCode} = require('../services/send_sms');
const {UserAccess} = require('../dao/user_access');
const {isIDGood} = require('./base');
const {sendRegistrationEmailMessage, sendResetPasswordEmailMessage} = require('../services/send_email');


/**************************************
 * 1_REGISTER CONTROLLER *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.register = async(req, res) => {
	try{
		const data = matchedData(req);
		await User.emailExists(data.email);
		const user = await User.registerUser(data);
		const userInfo = User.setUserInfo(user);
		const response = user.returnRegistrationToken(user, userInfo);
		sendRegistrationEmailMessage(user);
		res.status(201).json(response);
	}catch(err){
		handleError(res, buildErrObject(err.code, err.message));
	}
};

/************************************
 * VERIFY CONTROLLER *
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.verify = async (req, res) => {
	try {
		const user = await User.verificationExists(req.params.verification);
		res.status(200).json(await User.verifyUser(user));
	} catch (error) {
		handleError(res, error);
	}
};

/*****************************************
 * FORGOT_PASSWORD CONTROLLER *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.forgotPassword = async (req, res) => {
	try{
		const data = matchedData(req);
		await User.findUserByEmail(data.email);
		const forgotPass = await ForgotPassword.saveForgotPassword(req);
		sendResetPasswordEmailMessage(forgotPass);
		res.status(200).json(forgotPasswordResponse(forgotPass));
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};


/******************************************
 * GET REQ RESET PASSWORD
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getResetPassword = async (req, res) => {
	try{
		await ForgotPassword.findForgotPassword(req.params.verification);
		res.status(200).json({
			msg: 'NOW_RESET_PASSWORD'
		});
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};

/******************************************
 * POST REQ RESET PASSWORD
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.postResetPassword = async (req, res) => {
	try{
		const data = matchedData(req);
		const forgotPassword = await ForgotPassword.findForgotPassword(req.params.verification);
		const user = await User.findUserByEmail(forgotPassword.email);
		await User.updatePassword(user, data.password);
		const result = await ForgotPassword.markResetPasswordAsUsed(req, forgotPassword);
		res.status(200).json(result);
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};


/*********************************************
 * LOGIN CONTROLLER *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
	try {
		const data = matchedData(req);
		const user = await User.phoneExists(data.phone);
		await User.userIsBlocked(user);
		await User.checkLoginAttemptsAndBlockExpires(user);
		const isPasswordMatch =await User.checkPassword(data.password, user);
		if (!isPasswordMatch){
			await User.passwordsDoNotMatch(user);
		}else {
			user.loginAttempts = 0;
			await saveLoginAttemptsToDB(user);
			res.status(200).json(await UserAccess.saveUserAccessAndReturnToken(req, user));
		}
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};