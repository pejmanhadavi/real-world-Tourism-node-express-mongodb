const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;


//USER SCHEMA
const userSchema = new Schema({
    username: {
        type: String,
        match: [/^[a-zA-Z]+[a-zA-Z0-9\-\_\.]+[a-zA-Z0-9]$/, 'is invalid'],
        minlength: 4,
        maxlength: 50,
        lowercase: true,
        index: true,
        required: [true, 'USERNAME_IS_BLANK'],
    },
    password: {
        type: String ,
        minlength: 5,
        maxlength: 1024,
        required: [true, 'PASSWORD_IS_BLANK'],
    } ,
    phone: {
        type:String,
        required: [true, 'PHONE_IS_BLANK'],
    },
    verification: {
        type: String
    },
    verificationExpires: {
        type: Date
    },
    blockPhoneExpires: {
        type: Date,
        default: Date.now,
        select: false
    },
    verified: {
      type: Boolean,
      default: false
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    },
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