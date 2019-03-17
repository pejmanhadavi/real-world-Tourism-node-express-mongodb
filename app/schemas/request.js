const mongoose =  require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
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
	experiences: [{
		type: ObjectId,
		ref: 'Experience'
	}],
	tourLeaderUserId: {
		type :ObjectId,
		required: true
	},
	tourLeaderFirstValidate: {
		type: Boolean,
		default: false
	},
	userFinalValidate: {
		type: Boolean,
		default: false
	},
	tourLeaderFinalValidate: {
		type: Boolean,
		default: false
	},
	paid: {
		type: Boolean,
		default: false
	},
	userSatisfaction: {
		type: Boolean
	},
	tourLeaderSatisfaction: {
		type: Boolean
	},
	rated: {
		type: Boolean,
		default: false
	},
	factorNumber: {
		type: Number,
		default: Date.now
	}
}, {
	versionKey: false,
	timestamps: true
});


//EXPORT SCHEMA
module.exports.requestSchema = requestSchema;