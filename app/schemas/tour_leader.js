const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate');
const validator = require('validator');

//TOUR_LEADER SCHEMA
const tourLeaderSchema = new Schema({
    user: {
        required: [true, 'USER_IS_BLANK'],
        type: ObjectId,
        ref: 'User',
    },
    email: {
        required: [true, 'EMAIL_IS_BLANK'],
        type: String,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'IS_INVALID'],
        maxlength: 255,
        validate: {
            validator: validator.isEmail,
            message: 'EMAIL_IS_NOT_VALID'
        }
    },
    profileImage: {
        required: [true, 'PROFILE_IMAGE_IS_BLANK'],
        type: [String],
        validate: [(val)=>{
            return val.length <= 5;
        }, 'PHOTOS_AT_MOST_5']
    },
    backgroundImage: {
        required: [true, 'BACKGROUND_IMAGE_IS_BLANK'],
        type: String
    },
    name: {
        required: [true, 'NAME_IS_BLANK'],
        type: String,
        maxlength: 50,
    },
    lastname: {
        required: [true, 'LAST_NAME_IS_BLANK'],
        type: String,
        maxlength: 255,
    },
    languages: [{
        required: [true, 'LANGUAGES_IS_BLANK'],
        type: String,
        maxlength: 50,
    }],
    aboutMe: {
        required: [true, 'ABOUT_ME_IS_BLANK'],
        type: String,
        maxlength: 500,
    },
    metto: {
        required: [true, 'METTO_IS_BLANK'],
        type: String,
        maxlength: 70,
    },
    iWillShowYou: [{
        required: [true, 'I_WILL_SHOW_YOU_IS_BLANK'],
        type: String,
        maxlength: 50,
    }],
    scanBirthCertification: {
        required: [true, 'SCAN_BIRTH_CERTIFICATION_IS_BLANK'],
        type: String
    },
    birthCertificationVerified: {
        type: Boolean,
        default: false
    },
    scanTourleaderCertification: {
        type: String
    },
    tourleaderCertificationVerified: {
        type: Boolean,
        default: false
    },
    nationalId: {
        required: [true, 'NATION_ID_IS_BLANK'],
        type: String,
        maxlength: 10,
    },
    travelFacilities: [{
        required: [true, 'TRAVEL_FACILITIES_IS_BLANK'],
        type: ObjectId,
        ref: 'Facility'
    }],
    constPerDay:{
        required: [true, 'COST_PER_DAY_IS_BLANK'],
        type: Number,
        default: 0
    },
    constPerHalfDay:{
        required: [true, 'COST_PER_DAY_IS_BLANK'],
        type: Number,
        default: 0
    },
    city: {
        required: [true, 'CITY_IS_BLANK'],
        type: ObjectId,
        ref: 'City'
    },
    province: {
        required: [true, 'PROVINCE_IS_BLANK'],
        type: ObjectId,
        ref: 'Province'
    },
}, {
    timestamps: true
});
//PAGINATE PLUGIN
tourLeaderSchema.plugin(mongoosePaginate);

//EXPORT SCHEMA
module.exports.TourLeader = TourLeader;