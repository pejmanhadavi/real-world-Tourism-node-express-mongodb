const mongoose = require('mongoose');
const validator = require('validator');

//SCHEMA
const forgotPasswordSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			validate: {
				validator: validator.isEmail,
				message: 'EMAIL_IS_NOT_VALID'
			},
			lowercase: true,
			required: true
		},
		verification: {
			type: String
		},
		used: {
			type: Boolean,
			default: false
		},
		ipRequest: {
			type: String
		},
		browserRequest: {
			type: String
		},
		countryRequest: {
			type: String
		},
		ipChanged: {
			type: String
		},
		browserChanged: {
			type: String
		},
		countryChanged: {
			type: String
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

//INDEX
forgotPasswordSchema.index({
	email: 'text',
	verificationKey: 'text'
});

//EXPORTS SCHEMA
exports.forgotPasswordSchema = forgotPasswordSchema;