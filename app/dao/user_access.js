const mongoose = require('mongoose');
const {handleError, buildErrObject}= require('../services/error_handler');

const userAccessSchema = require('../schemas/user_access').userAccessSchema;
const User = require('../dao/user').User;

const {getIP, getCountry, getBrowserInfo} = require('../services/get_user_access');
const {generateToken} = require('../services/auth');

/*
STATICS
 */
//SAVE_USER_ACCESS_AND_RETURN_TOKEN
userAccessSchema.statics.saveUserAccessAndReturnToken = async (req, user) => {
  return new Promise((resolve, reject) => {
      const userAccess = new UserAccess({
          phone: user.phone,
          ip: getIP(req),
          browser: getBrowserInfo(req),
          country: getCountry(req),
      });
      userAccess.save()
          .then(result => {
              const userInfo = User.setUserInfo(user);
              //RETURN DATA WITH ACCESS TOKEN
              resolve({
                  token: generateToken(user._id),
                  user: userInfo
              });
          })
          .catch(err => reject(buildErrObject(422, err.message)));
  });
};



/*
CREATE AND EXPORT MODEL
 */
const UserAccess = mongoose.model('UserAccess', userAccessSchema);
exports.UserAccess  = UserAccess;
