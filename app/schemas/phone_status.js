const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//SCHEMA
const phoneSchema = new Schema({
	phone:{
		type:String,
		required: [true, 'PHONE_IS_BLANK'],
		select: false,
	},
	blockExpires : {
		type: Date,
	},
	attemps: {
		type: Number,
		default: 1
	}
});

//EXPORT SCHEMA
exports.phoneSchema= phoneSchema;