const mongoose = require('mongoose');
const dateFns = require('date-fns');
const phoneToken = require('generate-sms-verification-code');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomize = require('randomatic');




const userSchema = require('../schemas/user').userSchema;
const {handleError, buildErrObject}= require('../services/error_handler');
const {generateToken} = require('../services/auth');

const MINUTES_TO_EXPIRE_VERIFICATION = 2;
const LOGIN_ATTEMPTS = 4;
const HOURS_TO_BLOCK = 5;






/*************************
    * STATICS *
 ************************/


//DELETE NOT VERIFIED USERS
userSchema.statics.deleteNotVerifiedUsers = async () => {
    return new Promise((resolve, reject) => {
        User.deleteMany({
            verified: false,
            verificationExpires : {$lte: new Date()}
        }).then(result => resolve(result))
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

//CHECK USERNAME
userSchema.statics.usernameExists= async username =>{
    return new Promise((resolve, reject)=>{
        User.findOne({
            username: username,
        })
            .then(result => {
                if (result === null)
                    resolve(false);

                reject(buildErrObject(422, 'USERNAME_ALREADY_EXISTS'));
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

//CHECK IF VERIFICATION SENT
userSchema.statics.verificationSent= async (username, phone) =>{
    return new Promise((resolve, reject)=>{
        User.findOne({
            username,
            phone,
            verificationExpires : {$gte: new Date()}
        })
            .then(result => {
                if (result === null)
                    resolve(false);
                reject(buildErrObject(422, 'WAIT_VERIFICATION_SENT'));
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

//CHECK PHONE_REGISTER
userSchema.statics.phoneExists_register= async phone =>{
    return new Promise((resolve, reject)=>{
        User.findOne({
            phone: phone,
            verified: true
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
userSchema.statics.phoneExists = async phone =>{
    return new Promise((resolve, reject)=>{
        User.findOne({
            phone: phone,
            verified: true
        })
            .then(result => {
                if (result !== null)
                    resolve(result);
                reject(buildErrObject(404, 'PHONE_DOES_NOT_EXISTS'));
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
            .then(result => {
                if (result === null)
                    reject(buildErrObject(404, 'NOT_USER_OR_ALREADY_VERIFIED'));
                resolve(result);
            })
            .catch(err => reject(buildErrObject(422, err.message)));
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


//VERIFY USER
userSchema.statics.verifyUser = async (req, res, user) => {
    return new Promise((resolve, reject) => {
        if (user.verification !== req.verification ){
            handleError(res, buildErrObject(422, 'INVALID_VERIFICATION_CODE'));
            return;
        }
        if(user.verificationExpires <= new Date()){
            handleError(res, buildErrObject(422, 'VERIFICATION_CODE_EXPIRED'));
            return;
        }
        user.verified = true;

        user.save()
            .then(result => resolve({
                phone: result.phone,
                verified: result.verified
            }))
            .catch(err => reject(buildErrObject(422, err.message)));

    });
};

//GENERATE NEW PASSWORD
userSchema.statics.generateNewPassword = async () => {
    return randomize('Aa0', 12);

};


//UPDATE NEW PASSWORD
userSchema.statics.updatePassword = async (res, user, newPassword) => {
    return new Promise(async (resolve, reject) => {
        const salt = await bcrypt.genSalt(10);
        hashPassword = await bcrypt.hash(newPassword, salt);

        await user.update({
            password: hashPassword
        })
            .then(result => resolve(result))
            .catch(err => reject(buildErrObject(422, err.message)));

    });
};


//CHECK LOGIN ATTEMTPS AND BLOCK EXPIRES
userSchema.statics.checkLoginAttemptsAndBlockExpires = async user => {
    return new Promise((resolve, reject) => {
        if(blockIsExpired(user)){
            user.loginAttempts = 0;
            user.save()
                .then(result => resolve(result))
                .catch(err => buildErrObject(422, err.message));
        }else{
            resolve(true);
        }
    });
};


//PASSWORDS DO NOT MATCH
userSchema.statics.passwordsDoNotMatch = async user => {
    user.loginAttempts += 1;
    await this.saveLoginAttemptsToDB(user);
    return new Promise(async (resolve, reject) => {
        if (user.loginAttempts < LOGIN_ATTEMPTS) {
            reject(buildErrObject(409, 'WRONG_PASSWORD'));
        } else {
            reject(await blockUser(user));
        }
        reject(buildErrObject(422, 'ERROR'));
    });
};

//CHECK PASSWORD
userSchema.statics.checkPassword = async (password, user) => {
    return new Promise((resolve, reject) => {
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) {
                reject(buildErrObject(422, err.message))
            }
            if (!isMatch) {
                resolve(false)
            }
            resolve(true)
        });
    });
};

//COMPARE PASSWORD
userSchema.statics.comparePassword = (passwordAttempt, password, cb) => {
    bcrypt.compare(passwordAttempt, password, (err, isMatch) =>
        err ? cb(err) : cb(null, isMatch)
    )
};

//USER IS BLOCKED
userSchema.statics.userIsBlocked = async user => {
    return new Promise((resolve, reject) => {
        if(user.blockExpires > new Date())
            reject(buildErrObject(409, 'BLOCKED_USER'));
        resolve(true);
    });
};


//GET PROFILE FROM DB
userSchema.statics.getProfileFromDB = async id => {
    return new Promise((resolve, reject) => {
        User.findById(id, '-_id -updatedAt -createdAt')
            .then(result => {
                if (result === null)
                    reject(buildErrObject(404, 'NOT_FOUND'));
                resolve(result);
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

/***************************
    * METHODS *
 **************************/
//GEN SALT
userSchema.methods.genSalt = async function() {
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
};



//RETURN REGISTRATION TOKEN
userSchema.methods.returnRegistrationToken = (userInfo) => {

    return {
        token: generateToken(this._id),
        user: userInfo
    };
};

//FORGOT PASS RES
userSchema.methods.forgotPassResponse = () => {
    return {
        phone: this.phone,
        message: 'NEW_PASSWORD_SENT'
    }
};








/********************************
    * HELPERS *
 ********************************/

//BLOCK IS EXPIRED
const blockIsExpired = (user) =>
    user.loginAttempts > LOGIN_ATTEMPTS && user.blockExpires <= new Date()


//BLOCK USER
const blockUser = async user => {
    return new Promise((resolve, reject) => {
        user.blockExpires = dateFns.addHours(new Date(), HOURS_TO_BLOCK);
        user.save()
            .then(result => resolve(buildErrObject(409, 'BLOCKED_USER')))
            .catch(err => reject(buildErrObject(422, err.message)));

        });
    };

//SAVE LOGIN ATTEMPTS
exports.saveLoginAttemptsToDB = async user => {
    return new Promise((resolve, reject) => {
        user.save()
            .then(result => resolve(result))
            .catch(err => reject(buildErrObject(422, err.message)));
    });
};

/**************************************
    * CREATE AND EXPORT MODEL*
***************************************/
const User = mongoose.model('User', userSchema);
exports.User = User;


