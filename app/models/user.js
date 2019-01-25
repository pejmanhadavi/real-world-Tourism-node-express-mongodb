const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


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
        type: String , 
        required: [true, 'PASSWORD_IS_BLANK'],
        minlength: 5,
        maxlength: 1024,
        select: false
    } ,
    phone: {
        type:String,
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
        type: [String],
        validate: [(val)=>{
            return val.length <= 5;
        }, 'PHOTOS_AT_MOST_5']
    },
    backgroundImage: String,
    name: {
        type: String,
        maxlength: 50,
    }, 
    lastname: {
        type: String,
        maxlength: 255,
    },
    languages: [{
        type: String,
        maxlength: 50,
    }], 
    about: {
        type: String,
        maxlength: 500,
    },
    metto: {
        type: String,
        maxlength: 70,
    },
    iWillShowYou: [{
        type: String,
        maxlength: 50,
    }],
    scanBirthCertification: String,
    birthCertificationVerified: {
        type: Boolean,
        default: false
      },
    scanTourleaderCertification: String,
    tourleaderCertificationVerified: {
        type: Boolean,
        default: false
      },
    nationalId: {
        type: String,
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

const hash = (user, salt, next) => {
    bcrypt.hash(user.password, salt, null, (err, newHash) => {
        if(err)
            return next(err);
        user.password = newHash;

        return next();
    })
}


//compare passwords
userSchema.methods.comparePassword = function(passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  );
}

//hash password
userSchema.methods.genSalt = async function() {
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
}

//index
userSchema.index({
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