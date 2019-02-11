const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate');

//TOUR_LEADER SCHEMA
const tourLeaderSchema = new Schema({
	user: {
		required: [true, 'USER_IS_BLANK'],
		type: ObjectId,
		ref: 'User',
	},

	scanBirthCertification: {
		required: [true, 'SCAN_BIRTH_CERTIFICATION_IS_BLANK'],
		type: String
	},
	birthCertificationVerified: {
		type: Boolean,
		default: false
	},
	scanTourLeaderCertification: {
		type: String
	},
	tourLeaderCertificationVerified: {
		type: Boolean,
		default: false
	},
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
}, {
	timestamps: true
});
//PAGINATE PLUGIN
tourLeaderSchema.plugin(mongoosePaginate);

//EXPORT SCHEMA
module.exports.tourLeaderSchema = tourLeaderSchema;