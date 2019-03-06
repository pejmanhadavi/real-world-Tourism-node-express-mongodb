const {buildErrObject, handleError} = require('../services/error_handler');
const {isIDGood} = require('./base');

const {TourLeader}  = require('../dao/tour_leader');
const {Rate} = require('../dao/rate');
const {User} = require('../dao/user');
const {Message} = require('../dao/message');
const {Request} = require('../dao/request');


/************************
 * MAIN PAGE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.mainPage  = async (req, res) => {
  try{

      const tourLeaders = await TourLeader.find({verified: true},'costPerDay _id user')
          .populate('user', '_id name city motto profileImages');
      const rates = await Rate.find({},'tourLeader user comment star');
      res.status(200).json({
          tourLeaders: tourLeaders,
          rates: rates
      });
  }  catch (err) {
      handleError(res, buildErrObject(err.code, err.message));
  }
};


/***********************
 *  LOGGED IN CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.loggedIn = async (req, res) => {
  try{
      const userId = await isIDGood(req.user._id);

      const tourLeaders = await TourLeader.find({verified: true},'costPerDay _id user')
          .populate('user', '_id name city motto profileImages');

      const rates = await Rate.find({},'tourLeader user comment star');
      const userInfo = await User.findById(userId, 'name profileImages');

      const unreadMessages = await Message.count({author: {$ne: userId}})
          .populate({
              path: 'Request',
              match: {$or: [{user: userId}, {tourLeaderUserId: userId}]}
          });

      res.status(200).json({
          tourLeaders: tourLeaders,
          rates: rates,
          userInfo: userInfo,
          unreadMessages: unreadMessages
      });

  }  catch (err) {
      handleError(res, buildErrObject(err.code, err.message));
  }
};

/***************************
 * ME CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.me = async (req, res) => {
  try{
      const userId = await isIDGood(req.user._id);
      const userInfo = await User.findById(userId, 'profileImages name motto languages');
      const tourLeaderInfo = await TourLeader.findOne({user: userId}, 'const _id');
      let rate = null;
      if (tourLeaderInfo)
         rate = await Rate.find({tourLeader: tourLeaderInfo._id}, 'star comment');

      res.status(200).json({
         userInfo: userInfo,
         tourLeaderInfo: tourLeaderInfo,
         rate: rate
      });
  }  catch (err) {
      handleError(res, buildErrObject(err.code, err.message));
  }
};

/**************************
 * PROFILE CONTROLLER
 * @param req
 * @param res
 */
exports.profileSetting = async (req, res) => {
  try{
      const userId = await isIDGood(req.user._id);
      const userInfo = await User.findById(userId, 'profileImages name motto languages city aboutMe iWillShowYou email phone');
      const tourLeaderInfo = await TourLeader.findOne({user: userId}, 'const _id');

      res.status(200).json({
          userInfo: userInfo,
          tourLeaderInfo: tourLeaderInfo
      });
  }  catch (err) {
      handleError(res, buildErrObject(err.code, err.message));
  }
};

/****************************
 * TOUR LEADER PAGE CONTROLLER
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.tourLeaderPage = async (req, res) => {
  try{
      const id = await isIDGood(req.params.userId);
      const tourLeader = await TourLeader.findOne({user: id}, '_id cost');
      if (tourLeader === null)
          res.status(404).json({error: {code: 404, message: 'NOT_FOUND'}}).end();
      const userInfo = await User.findById(id, 'name city motto profileImages iWillShowYou aboutMe languages travelFacilities');
      const rate = await Rate.find({tourLeader: tourLeader._id}, '-updatedAt');
      res.status(200).json({
         tourLeaderInfo: tourLeader,
         userInfo : userInfo,
          rate: rate
      });
  }  catch (err) {
      console.log(err);
      handleError(res, buildErrObject(err.code, err.message));
  }
};