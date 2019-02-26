const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate');

// SCHEMA
const rateSchema = new Schema({
	tourLeader: {
		required: [true, 'TOUR_LEADER_IS_BLANK'],
		type: ObjectId,
		ref: 'TourLeader',
	},
	user: {
		required: [true, 'USER_IS_BLANK'],
		type: ObjectId,
		ref: 'User',
	},
	star: {
		type: Number,
		validate: {
			validator: (value) => {
				return value< 6;
			},
			message: 'STARTS_SHOULD_BE_LESS_THAN_5'
		}
	},
	comment: {
		type: String,
		maxLength: 500
	}

}, {
	timestamps: true
});
//PAGINATE PLUGIN
rateSchema.plugin(mongoosePaginate);

//EXPORT SCHEMA
module.exports.rateSchema = rateSchema;