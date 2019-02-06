const mongoose =  require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

//REQUEST SCHEMA
const requestSchema = new Schema({
	from: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	to: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	maxHourOccupancy: {
		type:Number,
		required: true
	},
	Verification: {
		type: Boolean,
		default: false,
	},
	description: {
		type: String,
		maxlength: 500
	}
}, {
	timestamps: true
});


//EXPORT SCHEMA
module.exports.requestSchema = requestSchema;