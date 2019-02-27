const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');

const {Rate} = require('../dao/rate');
const {Request} = require('../dao/request');


/**************************
 * RATE CONTROLLER
 * @param req
 * @param res
 */
exports.rateTourLeader = async (req, res) => {
    try{
        const userId = await isIDGood(req.user._id);
        //get request
        const requestId = await isIDGood(req.body.requestId);
        const tourLeaderId = await isIDGood(req.body.tourLeaderId);
        //check request rated
        await Request.isRequestRated(requestId);
        //set the rate to true
        await Request.setRate(requestId);
        //save the rate
        const response = await Rate.saveRate(req, tourLeaderId, userId);
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        handleError(res, buildErrObject(err.code, err.message));
    }
};

