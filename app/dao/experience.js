const mongoose = require('mongoose');

const {experienceSchema} = require('../schemas/experience');
const {buildErrObject} = require('../services/error_handler');




/*********************
 * STATICS
 ********************/

//CALCULATE AMOUNT OF REQUEST
experienceSchema.statics.calculateAmount  = experiences => {
    return new Promise((resolve, reject) => {
        let amount = 0;
        for (i in experiences){
            Experience.findById(experiences[i])
                .then(result => {
                    if (!result)
                        reject(buildErrObject(404, 'NOT_FOUND'));
                    amount += result.cost;
                })
                .catch(err => reject(buildErrObject(422, err.code)));
        }
        resolve(amount);
    });
};


/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Experience = mongoose.model('Experience', experienceSchema);
exports.Experience = Experience;