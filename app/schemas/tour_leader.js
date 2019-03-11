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
	verified: {
		type: Boolean,
		default: false
	},
	experiences: [{
		type: ObjectId,
		ref: 'Experience'
	}]
}, {
	timestamps: true
});
//PAGINATE PLUGIN
tourLeaderSchema.plugin(mongoosePaginate);

//EXPORT SCHEMA
module.exports.tourLeaderSchema = tourLeaderSchema;