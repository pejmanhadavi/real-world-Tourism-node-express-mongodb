const mongoose =  require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

//REQUEST SCHEMA
const requestSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	tourLeader: {
		type: ObjectId,
		ref: 'TourLeader',
		required: true
	},
	maxDayOccupancy: {
		type:Number,
		required: true
	},
	maxHalfDayOccupancy: {
		type:Number,
		required: true
	},
	description: {
		type: String,
		maxlength: 500
	},
	tourLeaderFirstVerified: {
		type: Boolean,
		default: false
	},
	userFinalVerified: {
		type: Boolean,
		default: false
	},
	tourLeaderFinalVerified: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});


//EXPORT SCHEMA
module.exports.requestSchema = requestSchema;