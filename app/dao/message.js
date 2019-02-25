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
//GET MESSAGE BY ID
messageSchema.statics.getMessageById = id => {
    return new Promise((resolve, reject) => {
        Message.findById(id)
            .then(result => {
                if (!result)
                    reject(buildErrObject(404, 'NOT_FOUND'));
                resolve(result);
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

//CHECK THE MESSAGE AUTHOR
messageSchema.statics.checkMessageAuthor = (messageId, userId) => {
    return new Promise((resolve, reject) => {
       Message.findOne({
           _id: messageId,
           author: userId
       })
           .then(result => {
               if (!result)
                   resolve(true);
               reject(buildErrObject(409, 'BAD_REQUEST'));
           })
           .catch(err => buildErrObject(422, err.message));
    });
};

//UPDATE READ MESSAGE
messageSchema.statics.updateMessageToRead = messageId => {
    return new Promise((resolve, reject) => {
        Message.findById(messageId)
            .then(async result => {
                if (!result)
                    reject(buildErrObject(404, 'NOT_FOUND'));
                result.read = true;
                await result.save();
                resolve({
                    message: result._id,
                    read: result.read
                });
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
} ;



/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Message = mongoose.model('Message', messageSchema);
exports.Message = Message;