const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validator = require('validator');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


//USER SCHEMA
const userSchema = new Schema({
	name: {
		type: String,
		match: [/^[a-zA-Z]+[a-zA-Z0-9\-_.]+[a-zA-Z0-9]$/, 'is invalid'],
		minlength: 4,
		maxlength: 50,
		lowercase: true,
		index: true,
		required: [true, 'NAME_IS_BLANK'],
	},
	password: {
		type: String ,
		minlength: 5,
		maxlength: 1024,
		required: [true, 'PASSWORD_IS_BLANK'],
	} ,
	email: {
		required: [true, 'EMAIL_IS_BLANK'],
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
	verification: {
		type: String
	},
	verified: {
		type: Boolean,
		default: false
	},
	phone: {
		type: String
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
		maxlength: 180,
	},
	profileImage: [{
		type: String,
		validate: [(val)=>{
			return val.length <= 5;
		}, 'PHOTOS_AT_MOST_5']
	}],
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
},{
	versionKey: false,
	timestamps: true
});


//INDEX
userSchema.index({
	username: 'text',
	phone: 'text',
	verification: 'text'
});

//PAGINATE
userSchema.plugin(mongoosePaginate);

//EXPORT SCHEMA
exports.userSchema = userSchema;