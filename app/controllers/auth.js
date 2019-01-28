const matchedData = require('express-validator/filter').matchedData;
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../dao/user').User;
const ForgotPassword = require('../dao/forgot_password').ForgotPassword;

const {buildErrObject, handleError} = require('../services/error_handler');
const {sendVerificationCode} = require('../services/send_sms');




//1_REGISTER CONTROLLER
exports.register = async(req, res) => {
    try{
        let data = matchedData(req);
        console.log();
        const doesPhoneExists = await User.phoneExists_register(data.phone);
        const doesUsernameExists = await User.usernameExists(data.username);
        if(!doesUsernameExists && !doesPhoneExists){
            const user = await User.registerUser(data);
            const userInfo = User.setUserInfo(user);
            const response = user.returnRegistrationToken(userInfo);
            User.expiresVerification(user);
            sendVerificationCode(res, user.phone, user.verification);
            res.status(201).json(response);
        }
    }catch(err){
        handleError(res, buildErrObject(422, err.message));
    }
};

//2_VERIFY CONTROLLER
exports.verify = async (req, res) => {
    try{
        let data = matchedData(req);
        const user = await User.verificationExists(data.id);
        if(!user){
            handleError(res, buildErrObject(422, 'NOT_USER_OR_ALREADY_REGISTERED'));
            return;
        }
        res.status(200).json(await User.verifyUser(data, res, user));
    }catch (err) {
        handleError(res, buildErrObject(422, err.message));
    }
};

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
};


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
};