const {buildErrObject, handleError} = require('../services/error_handler');
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



exports.loggedIn = async (req, res) => {
  try{
      const userId = req.user._id;
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
      console.log(err);
  }
};