const {buildErrObject, handleError} = require('../services/error_handler');
const {TourLeader}  = require('../dao/tour_leader');
const {Rate} = require('../dao/rate');

/************************
 * MAIN PAGE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.mainPage  = async (req, res) => {
  try{

      const tourLeaders = await TourLeader.find({verified: true},'costPerDay _id user')
          .populate('user', '_id name city motto profileImages travelFacilities');
      const rates = await Rate.find();
      res.status(200).json({
          tourLeaders: tourLeaders,
          rates: rates
      });
  }  catch (err) {
      console.log(err);
      handleError(res, buildErrObject(err.code, err.message));
  }
};