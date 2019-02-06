const mongoose = require('mongoose');

const userAccessSchema = new mongoose.Schema(
	{
		phone: {
			type: String,
			required: [true, 'PHONE_REQUIRED']
		},
		ip: {
			type: String,
			required: true
		},
		browser: {
			type: String,
			required: true
		},
		country: {
			type: String,
			required: true
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

userAccessSchema.index({
	email: 'text',
	ip: 'text',
	browser: 'text',
	country: 'text'
});



exports.userAccessSchema = userAccessSchema;
