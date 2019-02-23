const mongoose = require('mongoose');

const {messageSchema} = require('../schemas/message');
const {buildErrObject} = require('../services/error_handler');


/*********************
 * STATICS
 ********************/
//SAVE MESSAGE
messageSchema.statics.saveMessage = (requestId, userId, body) => {
    return new Promise((resolve, reject) => {
        const message = new Message({
           requestId: requestId,
           body: body,
           author: userId
        });
        message.save()
            .then(() => {
                resolve({
                    msg: 'MESSAGE_SAVED'
                });
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};



/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Message = mongoose.model('Message', messageSchema);
exports.Message = Message;