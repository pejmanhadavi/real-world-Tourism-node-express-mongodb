const {buildErrObject} = require('../services/error_handler');
const {base_controller} = require('../../messages');
const moment = require('jalali-moment');

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


exports.dateConverter = (date) => {
	let dd = date.getDate();
	let mm = date.getMonth()+1; 
	let yyyy = date.getFullYear();
	if(dd<10) 
	{
		dd='0'+dd;
	} 
	if(mm<10) 
	{
		mm='0'+mm;
	} 
	date = yyyy+'/'+mm+'/'+dd;
	date = moment(date, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');

	return date;
};
