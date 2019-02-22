const mongoose = require('mongoose');

const {messageSchema} = require('../schemas/message');
const {buildErrObject} = require('../services/error_handler');


/*********************
 * STATICS
 ********************/




/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Message = mongoose.model('Message', messageSchema);
exports.Message = messageSchema;