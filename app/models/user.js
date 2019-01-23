const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


//user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'USERNAME_IS_BLANK'],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        minlength: 4, 
        maxlength: 50,
        lowercase: true,
        unique: true,
        index: true,
    },
    password: {
        type: string , 
        required: [true, 'PASSWORD_IS_BLANK'],
        minlength: 5, 
        maxlength: 1024,
        select: false
    } ,
    phone: {
        type:string,
        required: [true, 'PHONE_IS_BLANK'],
        select: false,
        //es-indexed
    },
    phoneVerification: {
        type: String
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
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
    profileImage: {
        type: [string],
        validate: [()=>{
            return val.length <= 5;
        }, 'PHOTOS_AT_MOST_5']
    },
    backgroundImage: string,
    name: {
        type: string,
        maxlength: 50,
    }, 
    lastname: {
        type: string,
        maxlength: 255,
    },
    languages: [{
        type: string,
        maxlength: 50,
    }], 
    about: {
        type: string,
        maxlength: 500,
    },
    metto: {
        type: string,
        maxlength: 70,
    },
    iWillShowYou: [{
        type: string,
        maxlength: 50,
    }],
    scanBirthCertification: string,
    birthCertificationVerified: {
        type: Boolean,
        default: false
      },
    scanTourleaderCertification: string,
    TourleaderCertificationVerified: {
        type: Boolean,
        default: false
      },
    nationalId: {
        type: string, 
        maxlength: 10,
    },
    travelFacilities: [{
        type: ObjectId,
        ref: 'Facility'
    }],
    constPerHour:{
        type: Number, 
        default: 0
    },
    city: {
        type: ObjectId,
        ref: 'City'
    },
    province: {
      type: ObjectId,
      ref: 'Province'
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
    leaderVerified: {
        type: Boolean,
        default: false
    }
    
},{
    timestamps: true
});

//generate salt
const genSalt = (user, SALT_FACTOR, next) => {
   bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
     if (err) {
       return next(err);
     }
     return hash(user, salt, next);
   })
 }

//save 
UserSchema.pre('save', function(next) {
  const that = this;
  const SALT_FACTOR = 10;
  if (!that.isModified('password')) {
    return next();
  }
  return genSalt(that, SALT_FACTOR, next);
});

//compare passwords
UserSchema.methods.comparePassword = function(passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  );
}

//index
UserSchema.index({
  name: 'text',
  lastname: 'text',
  leaderVerified: 'text',
});

//pagination
userSchema.plugin(mongoosePaginate);

//create user model
const User = mongoose.model('User', userSchema);

//export user
module.exports.User = User;