const {buildErrObject} = require('../services/error_handler');
const {base_controller} = require('../../messages');

/***************************
    * IS GOOD ID *
 * @param id
 * @returns {Promise<*>}
 */
exports.isIDGood = async id => {
	return new Promise((resolve, reject) => {
		const goodID = String(id).match(/^[0-9a-fA-F]{24}$/);
		return goodID
			? resolve(id)
			: reject(buildErrObject(422, base_controller.ID_MALFORMED));
	});
};
