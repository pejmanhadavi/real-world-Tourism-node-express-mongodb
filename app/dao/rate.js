const mongoose = require('mongoose');

const {rateSchema} = require('../schemas/rate');
const {buildErrObject} = require('../services/error_handler');

/*********************
 * STATICS
 ********************/








/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Rate = mongoose.model('Rate', rateSchema);
exports.Rate = Rate;