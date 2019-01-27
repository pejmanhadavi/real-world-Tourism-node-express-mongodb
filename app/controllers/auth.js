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


//1_REGISTER CONTROLLER
exports.register = async(req, res) => {
    try{
        let data = matchedData(req);
        const doesPhoneExists = await phoneExists(data.phone);
        const doesUsernameExists = await usernameExists(data.username);
        if(!doesUsernameExists && !doesPhoneExists){
            const result = await registerUser(data);
            const userInfo = setUserInfo(result);
            const response = returnRegistrationToken(result, userInfo);
            sendVerificationCode(res, result);
            res.status(201).json(response);
        }
    }catch(err){
        handleError(res, buildErrObject(422, err.message));
    }
}

//2_VERIFY CONTROLLER
exports.verify = async (req, res) => {
    try{
        let data = matchedData(req);
        const user = await verificationExists(data.id);
        if(!user){
            handleError(res, buildErrObject(422, 'NOT_USER_OR_ALREADY_REGISTERED'));
            return;
        }
        res.status(200).json(await verifyUser(data, res, user));
    }catch (err) {
        handleError(res, buildErrObject(422, err.message));
    }
}

//3_FORGOT_PASSWORD CONTROLLER
exports.forgotPassword = async (req, res) => {
    try{
        let data = matchedData(req);
        const PhoneExists = await forgotPhoneExists(data.phone);
        console.log(PhoneExists);
        if (!PhoneExists){
            handleError(res, buildErrObject(404, 'PHONE_NOT_FOUND'));
            return;
        }

        console.log(data.phone);
        const result = await saveForgotPassword(data);
        sendVerificationCode(res, result);
        res.status(200).json(forgotPasswordResponse(result));

    }catch (err) {
        handleError(res, buildErrObject(422, err.message));
    }
}

//4_FORGOT_VERIFY CONTROLLER
exports.forgotVerify = async (req, res) => {
    try{
        let data = matchedData(req);
        const forgotPassword = findForgotPassword(data.id);
        const user = await findUserByPhone(data.phone);

    }catch (err) {
        handleError(res, buildErrObject(422, err.message));
    }
}

/*
1_REGISTER METHODS
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
2_VERIFY METHODS
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
3_FORGOT_PASSWORD METHODS
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
        id: item._id,
        msg: 'RESET_SMS_SENT',
        verification: item.verification
    }
}

/*
4_FORGOT_VERIFY METHODS
 */
const findForgotPassword = async id => {
    return new Promise((resolve, reject) => {
        ForgotPassword.findOne({
            _id: id,
            used: false
        })
            .then(result => {
                if (result===null)
                    reject(buildErrObject(404, 'NOT_FOUND_OR_ALREADY_USED'));
                resolve(result);
            })
            .catch(err=> reject(buildErrObject(422, err.message)));
    })
}

const findUserByPhone = async phone => {
    return new Promise((resolve, reject) => {
        User.findOne({
            phone
        })
            .then(result => {
                if (result === null)
                    reject(buildErrObject(404, 'NOT_FOUND'));

                resolve(result);
            })
            .catch(err => reject(buildErrObject(422, err.message)));
    })
}