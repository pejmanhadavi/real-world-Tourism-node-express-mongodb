const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validator = require('validator');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


//USER SCHEMA
const userSchema = new Schema({
	name: {
		type: String,
		minlength: 4,
		maxlength: 100,
		lowercase: true,
		index: true,
		required: [true, 'NAME_IS_BLANK'],
	},
	phone: {
		required: [true, 'PHONE_IS_BLANK'],
		type: String,
	},
	password: {
		type: String ,
		minlength: 5,
		maxlength: 1024,
		required: [true, 'PASSWORD_IS_BLANK'],
	} ,
	email: {
		type: String,
		lowercase: true,
		unique: true,
		match: [/\S+@\S+\.\S+/, 'IS_INVALID'],
		maxlength: 255,
		validate: {
			validator: validator.isEmail,
			message: 'EMAIL_IS_NOT_VALID'
		}
	},
	phoneVerification: {
		type: String
	},
	phoneVerificationExpires: {
		type: Date,
	},
	phoneVerified: {
		type: Boolean,
		default: false
	},
	loginAttempts: {
		type: Number,
		default: 0,
	},
	blockExpires: {
		type: Date,
		default: Date.now,
	},
	city: {
		type: ObjectId,
		ref: 'City'
	},
	province: {
		type: ObjectId,
		ref: 'Province'
	},
	aboutMe: {
		type: String,
		maxlength: 500,
	},
	motto: {
		type: String,
		maxlength: 300,
	},
	profileImages: {
		type: [String],
		validate: {validator: (val) => {
			return val.length<6;
		},
		message: 'PROFILE_SHOULD_BE_AT_MOST_5'}
	},
	backgroundImage: {
		type: String
	},
	languages: [{
		type: String,
		maxlength: 50,
	}],
	iWillShowYou: [{
		type: String,
		maxlength: 180,
	}],
	travelFacilities: [{
		type: ObjectId,
		ref: 'Facility'
	}],
	isAdmin: {
		type: Boolean,
		default: false
	}
},{
	versionKey: false,
	timestamps: true
});


//INDEX
userSchema.index({
	username: 'text',
	email: 'text',
	verification: 'text'
});

//PAGINATE
userSchema.plugin(mongoosePaginate);

//EXPORT SCHEMA
exports.userSchema = userSchema;
