const {isIDGood} = require('./base');
const {resizeImage} = require('../services/resize_image');
const {User} = require('../dao/user');
const {handleResponse} = require('../services/response_handler');
const {profile_controller} = require('../../messages');

/**************************
 * GET_PROFILE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getProfile = async (req, res, next) => {
	try{
		const id = await isIDGood(req.user._id);
		const response = await User.getProfileFromDB(id);
		handleResponse(res, 200, profile_controller.GET_PROFILE, response);
	}catch (err) {
		next(err);
	}
};


/****************************
 * UPDATE_PROFILE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.updateProfile = async (req, res, next) => {
	try {
		const id = await isIDGood(req.user._id);
		const response = await User.updateProfileInDB(req, id);
		handleResponse(res, 200, 'PROFILE_UPDATED', response);
	}catch (err) {
		next(err);
	}
};


/*****************************
 * UPDATE PASSWORD CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.updatePassword = async (req, res, next) => {
	try{
		const id = await isIDGood(req.user._id);
		const response = await User.updatePasswordInProfile(req, id);
		handleResponse(res, 200, profile_controller.PASSWORD_UPDATED, response);
	}catch (err) {
		next(err);
	}
};


/***************************
 * UPDATE PROFILE IMAGE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.updateProfileImage = async (req, res, next) => {
	try{
		const id = await isIDGood(req.user._id);
		const response = await User.updateProfileImage(req, id);
		resizeImage(response.profile);
		handleResponse(res, 200, profile_controller.PROFILE_IMAGE_UPDATED, response);
	}catch (err) {
		next(err);
	}
};


/***************************
 * UPDATE BACKGROUND IMAGE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.updateBackgroundImage = async (req, res, next) => {
	try{
		const id = await isIDGood(req.user._id);
		const response = await User.updateBackgroundImage(req, id);
		handleResponse(res, 200, profile_controller.BACKGROUND_IMAGE_UPDATED, response);
	}catch (err) {
		next(err);
	}
};

/********************************
 * DELETE PROFILE IMAGE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.deleteProfileImage = async (req, res, next) => {
	try {
		const id = await isIDGood(req.user._id);
		const response = await User.deleteProfileImage(id, req.params.profile);
		handleResponse(res, 200, profile_controller.PROFILE_IMAGE_DELETED, response);
	}catch (err) {
		next(err);
	}
};


/**************************
 * DELETE BACKGROUND IMAGE CONTROLLER
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.deleteBackgroundImage = async (req, res, next) => {
	try{
		const id = await isIDGood(req.user._id);
		const response = await User.deleteBackgroundImage(id);
		handleResponse(res, 200, profile_controller.BACKGROUND_IMAGE_DELETED, response);
	}catch (err) {
		next(err);
	}
};





