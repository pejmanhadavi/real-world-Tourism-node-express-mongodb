const mongoose = require('mongoose');

const {requestSchema} = require('../schemas/request');
const {buildErrObject} = require('../services/error_handler');


/*********************
 * STATICS
 ********************/
//SAVE REQUEST
requestSchema.statics.saveRequest = (req, userId, tourLeaderId) => {
    return new Promise((resolve, reject) => {
        const request = new Request({
            user: userId,
            tourLeader: tourLeaderId,
            maxDayOccupancy: req.body.maxDayOccupancy,
            maxHalfDayOccupancy: req.body.maxHalfDayOccupancy,
            description: req.body.description
        });
        request.save()
            .then(() => resolve({
                msg: 'REQUEST_SAVED'
            }))
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};


/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Request = mongoose.model('Request', requestSchema);
exports.Request = Request;