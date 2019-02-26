const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');

const {Rate} = require('../dao/rate');


/**************************
 * RATE CONTROLLER
 * @param req
 * @param res
 */
exports.rateTourLeader = (req, res) => {
    try{

    } catch (err) {
        console.log(err);
        handleError(res, buildErrObject(err.code, err._message));
    }
};

