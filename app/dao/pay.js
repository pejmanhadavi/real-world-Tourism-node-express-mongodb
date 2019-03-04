const mongoose = require('mongoose');

const {paySchema} = require('../schemas/pay');
const {buildErrObject} = require('../services/error_handler');


/*********************
 * STATICS
 ********************/





/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Pay = mongoose.model('Pay', paySchema);
exports.Pay = Pay;