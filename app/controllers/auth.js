const matchedData = require('express-validator/filter').matchedData;

const {User, saveLoginAttemptsToDB} = require('../dao/user');
const {ForgotPassword} = require('../dao/forgot_password');
const {UserRefresh} = require('../dao/user_refresh');
const {sendRegistrationEmailMessage, sendResetPasswordEmailMessage} = require('../services/send_email');
const {generateToken} = require('../services/auth');
const {handleResponse} = require('../services/response_handler');
const {auth_controller} = require('../../messages');

/**************************************
 * 1_REGISTER CONTROLLER *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.register = async(req, res, next) => {
	try{
		const data = matchedData(req);
		await User.emailExists(data.email);
		const user = await User.registerUser(data);
		const userInfo = User.setUserInfo(user);
		const response = user.returnRegistrationToken(user, userInfo);
		sendRegistrationEmailMessage(user);
		handleResponse(res, 201, auth_controller.USER_REGISTERED_VERIFY_EMAIL, response);
	}catch(err){
		next(err);
	}
};

/************************************
 * VERIFY CONTROLLER *
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.verify = async (req, res, next) => {
	try {
		const user = await User.verificationExists(req.params.verification);
		const response = await User.verifyUser(user);
		handleResponse(res, 200, auth_controller.EMAIL_VERIFIED_NOW_LOGIN, response);
	} catch (err) {
		next(err);
	}
};

/*****************************************
 * FORGOT_PASSWORD CONTROLLER *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.forgotPassword = async (req, res, next) => {
	try{
		const data = matchedData(req);
		await User.findUserByEmail(data.email);
		const forgotPass = await ForgotPassword.saveForgotPassword(req);
		sendResetPasswordEmailMessage(forgotPass);
		handleResponse(res, 200, auth_controller.RESET_EMAIL_SENT, data.email);
	}catch (err) {
		next(err);
	}
};


/******************************************
 * GET REQ RESET PASSWORD
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getResetPassword = async (req, res, next) => {
	try{
		await ForgotPassword.findForgotPassword(req.params.verification);
		handleResponse(res, 200, auth_controller.RESET_PASSWORD_PAGE, {
			msg:'RESET_PASSWORD'
		});
	}catch (err) {
		next(err);
	}
};

/******************************************
 * POST REQ RESET PASSWORD
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.postResetPassword = async (req, res, next) => {
	try{
		const data = matchedData(req);
		const forgotPassword = await ForgotPassword.findForgotPassword(req.params.verification);
		const user = await User.findUserByEmail(forgotPassword.email);
		await User.updatePassword(user, data.password);
		const result = await ForgotPassword.markResetPasswordAsUsed(req, forgotPassword);
		await ForgotPassword.deleteUnusedForgotPasswords(forgotPassword.email);
		handleResponse(res, 200, auth_controller.PASSWORD_CHANGED, result);
	}catch (err) {
		next(err);
	}
};


/*********************************************
 * LOGIN CONTROLLER *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.login = async (req, res, next) => {
	try {
		const data = matchedData(req);
		const user = await User.findUserByEmail(data.email);
		await User.userIsBlocked(user);
		await User.checkLoginAttemptsAndBlockExpires(user);
		const isPasswordMatch = await User.checkPassword(data.password, user);
		if (!isPasswordMatch) {
			await User.passwordsDoNotMatch(user);
		} else {
			// all ok, register access and return token
			user.loginAttempts = 0;
			await saveLoginAttemptsToDB(user);
			const response = await UserRefresh.saveUserRefreshAndReturnToken(req, user);
			res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token');
			res.set('x-token', response.token);
			res.set('x-refresh_token', response.refreshToken);
			handleResponse(res, 200, auth_controller.LOGGED_IN, response.user);
		}
	} catch (err) {
		next(err);
	}
};

/****************************
 * GENERATE ACCESS TOKEN CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.token = async (req, res, next) => {
	try{
		const refreshToken = req.header('x-refresh-token');
		const userId = await UserRefresh.findRefreshAndReturnUserId(refreshToken);
		const response = {
			token: generateToken(userId),
		};
		res.set('x-token', response.token);
		handleResponse(res, 200, auth_controller.TOKEN_REFRESHED, response);

	}catch (err) {
		next(err);
	}
};
