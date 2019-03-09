const {isIDGood} = require('./base');
const {resizeImage} = require('../services/resize_image');
const {User} = require('../dao/user');


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
		res.status(200).json(await User.getProfileFromDB(id));
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
		res.status(200).json(await User.updateProfileInDB(req, id));
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
		res.status(200).json(await User.updatePasswordInProfile(req, id));
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
		res.status(200).json(response);
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
		res.status(200).json(await User.updateBackgroundImage(req, id));
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
		const result = await User.deleteProfileImage(id, req.params.profile);
		res.status(200).json(result);
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
		const result = await User.deleteBackgroundImage(id);
		res.status(200).json(result);
	}catch (err) {
		next(err);
	}
};





