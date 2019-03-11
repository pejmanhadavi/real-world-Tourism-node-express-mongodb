const mongoose = require('mongoose');

const {experienceSchema} = require('../schemas/experience');
const {buildErrObject} = require('../services/error_handler');




/*********************
 * STATICS
 ********************/




/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Experience = mongoose.model('Experience', experienceSchema);
exports.Experience = Experience;