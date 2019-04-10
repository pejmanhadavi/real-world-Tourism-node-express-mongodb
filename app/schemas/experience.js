const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const experienceSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	cost: {
		type: Number,
		required: true
	},
	description: {
		type: String
	},
	profile: {
		type: String,
		required: true
	},
	images: {
		type: [String],
		required: true
	},
	reviews: {
		type: Number,
		default: 0
	}
}, {
	versionKey: false
});


experienceSchema.plugin(mongoosePaginate);

exports.experienceSchema = experienceSchema;
