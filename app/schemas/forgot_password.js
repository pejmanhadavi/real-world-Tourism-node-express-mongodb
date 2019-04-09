const mongoose = require('mongoose');
const validator = require('validator');

//SCHEMA
const forgotPasswordSchema = new mongoose.Schema(
	{
		phone: {
			required: [true, 'PHONE_IS_BLANK'],
			type: String,
		},
		verification: {
			type: String
		},
		used: {
			type: Boolean,
			default: false
		},
		finalUsed: {
			type: Boolean,
			default: false
		},
		expires: {
			type: Date,
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
