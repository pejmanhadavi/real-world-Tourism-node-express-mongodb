
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

//MESSAGE SCHEMA
const messageSchema = new Schema({
	requestId: {
		type: ObjectId,
		ref: 'Request'
	},
	body: {
		type: String,
		required: true,
		maxlength: 1024,
	},
	author: {
		type: ObjectId,
		ref: 'User'
	},
	read: {
		type: Boolean,
		default: false
	}
},
{
	timestamps: true
});

//EXPORT SCHEMA
module.exports.messageSchema = messageSchema;