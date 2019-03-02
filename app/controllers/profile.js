const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');
const {resizeImage} = require('../services/resize_image');
const {User} = require('../dao/user');


/**************************
 * GET_PROFILE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getProfile = async (req, res) => {
	try{
		const id = await isIDGood(req.user._id);
		res.status(200).json(await User.getProfileFromDB(id));
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};


/****************************
 * UPDATE_PROFILE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.updateProfile = async (req, res) => {
	try {
		const id = await isIDGood(req.user._id);
		res.status(200).json(await User.updateProfileInDB(req, id));
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};


/*****************************
 * UPDATE PASSWORD CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.updatePassword = async (req, res) => {
	try{
		const id = await isIDGood(req.user._id);
		res.status(200).json(await User.updatePasswordInProfile(req, id));
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};


/***************************
 * UPDATE PROFILE IMAGE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.updateProfileImage = async (req, res) => {
	try{
		const id = await isIDGood(req.user._id);
		const response = await User.updateProfileImage(req, id);
		resizeImage(response.profile);
		res.status(200).json(response);
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};


/***************************
 * UPDATE BACKGROUND IMAGE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.updateBackgroundImage = async (req, res) => {
	try{
		const id = await isIDGood(req.user._id);
		res.status(200).json(await User.updateBackgroundImage(req, id));
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};

/********************************
 * DELETE PROFILE IMAGE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.deleteProfileImage = async (req, res) => {
	try {
		const id = await isIDGood(req.user._id);
		const result = await User.deleteProfileImage(id, req.params.profile);
		res.status(200).json(result);
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};


/**************************
 * DELETE BACKGROUND IMAGE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.deleteBackgroundImage = async (req, res) => {
	try{
		const id = await isIDGood(req.user._id);
		const result = await User.deleteBackgroundImage(id);
		res.status(200).json(result);
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};





