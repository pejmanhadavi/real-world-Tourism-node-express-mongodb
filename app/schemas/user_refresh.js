const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;



const userRefreshSchema = new Schema({
   userId: {
       type: ObjectId,
       required: true
   },
    refreshToken: {
      type: String,
      required: true
    },
    ip: {
        type: String,
        required: true
    },
    browser: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
},
{
    versionKey: false,
        timestamps: true
});



exports.userRefreshSchema = userRefreshSchema;

