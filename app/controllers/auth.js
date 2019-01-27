const matchedData = require('express-validator/filter').matchedData;
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/user').User;
const ForgotPassword = require('../models/forgot_password').ForgotPassword;
const phoneToken = require('generate-sms-verification-code');

const usernameExists = require('./base').usernameExists;
const phoneExists = require('./base').phoneExists;
const forgotPhoneExists = require('./base').forgotPhoneExists;
const buildErrObject = require('./base').buildErrObject;
const handleError = require('./base').handleError;
const sendVerificationCode = require('./base').sendVerificationCode;


//REGISTER CONTROLLER
exports.register = async(req, res) => {
    try{
        req = matchedData(req);
        const doesPhoneExists = await phoneExists(req.phone);
        const doesUsernameExists = await usernameExists(req.username);
        if(!doesUsernameExists && !doesPhoneExists){
            const result = await registerUser(req);
            const userInfo = setUserInfo(result);
            const response = returnRegistrationToken(result, userInfo);
            sendVerificationCode(res, result);
            res.status(201).json(response);
        }
    }catch(err){
        handleError(res, buildErrObject(422, err.message));
    }
}

//VERIFY CONTROLLER
exports.verify = async (req, res) => {
    try{
        req = matchedData(req);
        const user = await verificationExists(req.id);
        if(!user){
            handleError(res, buildErrObject(422, 'NOT_USER_OR_ALREADY_REGISTERED'));
            return;
        }
        res.status(200).json(await verifyUser(req, res, user));
    }catch (err) {
        handleError(res, buildErrObject(422, err.message));
    }
}

//FORGOT_PASSWORD CONTROLLER
exports.forgotPassword = async (req, res) => {
    try{
        req = matchedData(req);
        const PhoneExists = await forgotPhoneExists(req.phone);
        console.log(PhoneExists);
        if (!PhoneExists){
            handleError(res, buildErrObject(404, 'PHONE_NOT_FOUND'));
            return;
        }

        console.log(req.phone);
        const result = await saveForgotPassword(req);
        sendVerificationCode(res, result);
        res.status(200).json(forgotPasswordResponse(result));

    }catch (err) {
        handleError(res, buildErrObject(422, err.message));
    }
}

/*
REGISTER METHODS
 */
const registerUser = async req => {
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
}


const setUserInfo = (req) => {
    const user = {
        _id: req._id,
        username: req.username,
        phone: req.phone,
        verified: req.verified
    };
    return user;
}



const returnRegistrationToken = (user, userInfo) => {
    userInfo.verification = user.verification;
    return {
        token: generateToken(user._id),
        user: userInfo
    };
}


const generateToken = id => {
    const obj = {
        _id: id
    };

    //Instead of config.get('JWT_SECRET') i can use process.env
    return jwt.sign(obj, config.get('JWT_SECRET')
        , {
        //Instead of config.get('JWT_EXPIRATION') i can use process.env
        // expiresIn: config.get('JWT_EXPIRATION')
    });
}

/*
VERIFY METHODS
 */
const verificationExists = async id => {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: id,
            verified: false
        })
            .then(result => resolve(result))
            .catch(err => reject(err));
    })
}

const verifyUser = async (req, res, user) => {
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
                verified: result.verified}))
            .catch(err => reject(buildErrObject(err.code, err.message)));

    });
}

/*
FORGOT_PASSWORD METHODS
 */

const saveForgotPassword = async req => {
    return new Promise((resolve, reject) => {
        const forgot = new ForgotPassword({
            phone: req.phone,
            verification: phoneToken(6, {type: 'string'}),
        });
        console.log(forgot);
        forgot.save()
            .then(result => resolve(result))
            .catch(err => reject(buildErrObject(422, err.message)));
    });
}

const forgotPasswordResponse = item => {
    return {
        msg: 'RESET_SMS_SENT',
        verification: item.verification
    }
}