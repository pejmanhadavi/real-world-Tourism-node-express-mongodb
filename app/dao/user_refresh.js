const mongoose = require('mongoose');
const randToken = require('rand-token');

const {buildErrObject}= require('../services/error_handler');
const {userRefreshSchema} = require('../schemas/user_refresh');
const {User} = require('../dao/user');
const {getIP, getCountry, getBrowserInfo} = require('../services/get_user_access');

/********************
 * STATICS *
 ******************/


/***************************************
 * CREATE AND EXPORT MODEL *
 **************************************/
const UserRefresh = mongoose.model('UserRefresh', userRefreshSchema);
exports.UserRefresh = UserRefresh;