const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');
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



exports.deleteBackgroundImage = async (req, res) => {
	try{
		const id = await isIDGood(req.user._id);
		const result = await User.deleteBackgroundImage(id);
		res.status(200).json(result);
	}catch (err) {
		handleError(res, buildErrObject(err.code, err.message));
	}
};





