const mongoose = require('mongoose');

const {rateSchema} = require('../schemas/rate');
const {buildErrObject} = require('../services/error_handler');

/*********************
 * STATICS
 ********************/
rateSchema.statics.saveRate = (req, tourLeaderId, userId) => {
    return new Promise((resolve, reject) => {
        const rate = new Rate({
            tourLeader: tourLeaderId,
            user: userId,
            comment: req.body.comment,
            star: req.body.star
        });
        rate.save()
            .then(() => {
               resolve({
                   msg: 'RATED'
               });
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};







/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Rate = mongoose.model('Rate', rateSchema);
exports.Rate = Rate;