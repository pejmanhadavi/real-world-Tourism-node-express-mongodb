const mongoose = require('mongoose');
const dateFns = require('date-fns');
const phoneToken = require('generate-sms-verification-code');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = require('../schemas/user').userSchema;
const {handleError, buildErrObject}= require('../services/error_handler');

const MINUTES_TO_EXPIRE_VERIFICATION = 2;






/*
STATICS
 */
//CHECK USERNAME
userSchema.statics.usernameExists = async username =>{
    return new Promise((resolve, reject)=>{
        username = username.toLowerCase();
        User.findOne({
            username
        })
            .then(result => {
                if (result === null)
                    resolve(false);

                reject(buildErrObject(422, 'USERNAME_ALREADY_EXISTS'));
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

//CHECK PHONE_REGISTER
userSchema.statics.phoneExists_register= async phone =>{
    return new Promise((resolve, reject)=>{
        User.findOne({
            phone
        })
            .then(result => {
                if (result === null)
                    resolve(false);

                reject(buildErrObject(422, 'PHONE_ALREADY_EXISTS'));
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

//CHECK PHONE_FORGOT
userSchema.statics.phoneExists_forgot = async phone =>{
    return new Promise((resolve, reject)=>{
        User.findOne({
            phone
        })
            .then(result => {
                console.log('result '+result);
                if (result !== null)
                    resolve(true);

                resolve(false);
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

//CHECK PHONE_REGISTER
userSchema.statics.userVerified= async phone =>{
    return new Promise((resolve, reject)=>{
        User.findOne({
            phone
        })
            .then(result => {
                if (result === null)
                    resolve(false);

                reject(buildErrObject(422, 'PHONE_ALREADY_EXISTS'));
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

//REGISTER
userSchema.statics.registerUser = async req => {
    return new Promise(async (resolve, reject) => {
        const user = new User({
            username: req.username,
            password: req.password,
            phone: req.phone,
            verification: phoneToken(6, {type: 'string'})
        });

        await user.genSalt();
        user.save()
            .then(result => resolve(result))
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

//SET USER INFO
userSchema.statics.setUserInfo = (req) => {
    const user = {
        _id: req._id,
        username: req.username,
        phone: req.phone
    };
    return user;
};

//VERIFICATION EXISTS
userSchema.statics.verificationExists = async id => {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: id,
            verified: false
        })
            .then(result => resolve(result))
            .catch(err => reject(err));
    })
};


//EXPIRE VERIFICATION
userSchema.statics.expiresVerification = async (user) => {
    return new Promise((resolve, reject) => {
        user.verificationExpires = dateFns.addMinutes(new Date, MINUTES_TO_EXPIRE_VERIFICATION);
        user.save()
            .then(result => resolve(result))
            .catch(err => reject(buildErrObject(err.code, err.message)));
    });
};



/*
METHODS
 */
//COMPARE PASSWORD
userSchema.methods.comparePassword = function(passwordAttempt, cb) {
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
        err ? cb(err) : cb(null, isMatch)
    );
};
//GEN SALT
userSchema.methods.genSalt = async function() {
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
};


//VERIFY USER
userSchema.methods.verifyUser = async (req, res) => {
    return new Promise((resolve, reject) => {
        if (this.verification !== req.verification ){
            handleError(res, buildErrObject(422, 'INVALID_VERIFICATION_CODE'));
            return;
        }
        if(this.verificationExpires <= new Date()){
            handleError(res, buildErrObject(422, 'VERIFICATION_CODE_EXPIRED'));
            return;
        }
        this.verified = true;

        this.save()
            .then(result => resolve({
                phone: result.phone,
                verified: result.verified}))
            .catch(err => reject(buildErrObject(err.code, err.message)));

    });
};


//RETURN REGISTRATION TOKEN
userSchema.methods.returnRegistrationToken = (userInfo) => {
    userInfo.verification = this.verification;
    return {
        token: generateToken(this._id),
        user: userInfo
    };
};





/*
HELPERS
 */


//HASH
const hash = (user, salt, next) => {
    bcrypt.hash(user.password, salt, null, (err, newHash) => {
        if(err)
            return next(err);
        user.password = newHash;

        return next();
    })
};


//GENERATE TOKEN
const generateToken = id => {
    const obj = {
        _id: id
    };

    return jwt.sign(obj, config.get('JWT_SECRET')
        // , {expiresIn: config.get('JWT_EXPIRATION')}
    );
};


/*
CREATE AND EXPORT MODEL
 */
const User = mongoose.model('User', userSchema);
exports.User = User;


