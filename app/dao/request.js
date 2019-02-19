const mongoose = require('mongoose');

const {requestSchema} = require('../schemas/request');
const {buildErrObject} = require('../services/error_handler');


/*********************
 * STATICS
 ********************/



/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Request = mongoose.model('Request', requestSchema);
exports.Request = Request;