const mongoose = require('mongoose');
const validator = require('validator');

const userAccessSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			validate: {
				validator: validator.isEmail,
				message: 'EMAIL_IS_NOT_VALID'
			},
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
