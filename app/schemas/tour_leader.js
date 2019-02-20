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
		type: String
	},
	scanTourLeaderCertification: {
		type: String
	},
	costPerDay:{
		required: [true, 'COST_PER_DAY_IS_BLANK'],
		type: Number,
		default: 0
	},
	costPerHalfDay:{
		required: [true, 'COST_PER_DAY_IS_BLANK'],
		type: Number,
		default: 0
	},
	verified: {
		type: Boolean,
		default: false
	},
	comments: [{
		type: String,
		maxlength: 500,
	}],
	starts: [{
		type: Number
	}]
}, {
	timestamps: true
});
//PAGINATE PLUGIN
tourLeaderSchema.plugin(mongoosePaginate);

//EXPORT SCHEMA
module.exports.tourLeaderSchema = tourLeaderSchema;