const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


//user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'USERNAME_IS_BLANK'],
        match: [/^[a-zA-Z]+[a-zA-Z0-9\-\_\.]+[a-zA-Z0-9]$/, 'is invalid'],
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