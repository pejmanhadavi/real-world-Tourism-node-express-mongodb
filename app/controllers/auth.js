const matchedData = require('express-validator/filter').matchedData;

const User = require('../dao/user').User;
const PhoneStatus = require('../dao/phone_status').PhoneStatus;

const {buildErrObject, handleError} = require('../services/error_handler');
const {sendVerificationCode} = require('../services/send_sms');




//1_REGISTER CONTROLLER
exports.register = async(req, res) => {
    try{

        const data = matchedData(req);

        //DROP NOT VERIFIED USERS
        await User.deleteNotVerifiedUsers();


        //PHONE STATUS
        const phoneStatus = await PhoneStatus.phoneExists(data.phone);

        const doesPhoneExists = await User.phoneExists_register(data.phone);
        const doesUsernameExists = await User.usernameExists(data.username);

        //REGISTER
        if(!doesUsernameExists && !doesPhoneExists){
            if (phoneStatus){
                await PhoneStatus.phoneIsBlocked(phoneStatus);
                await PhoneStatus.checkRegisterAttemptsAndBlockExpires(phoneStatus);
                await PhoneStatus.incrementAttemps(phoneStatus);
                await PhoneStatus.blockPhone(phoneStatus);
            }
            else if (!phoneStatus && !doesPhoneExists){
                await PhoneStatus.registerPhone(data.phone);
            }
            const user = await User.registerUser(data);
            const userInfo = User.setUserInfo(user);
            const response = user.returnRegistrationToken(userInfo);
            User.expiresVerification(user);
            sendVerificationCode(res, user.phone, user.verification);
            res.status(201).json(response);
        }

    }catch(err){
        handleError(res, buildErrObject(err.code, err.message));
    }
};

//2_VERIFY CONTROLLER
exports.verify = async (req, res) => {
    try{
        const data = matchedData(req);
        const user = await User.verificationExists(data.id);
        console.log(user);
        await PhoneStatus.deletePhoneStatus(user.phone);
        res.status(200).json(await User.verifyUser(data, res, user));
    }catch (err) {
        handleError(res, buildErrObject(err.code, err.message));
    }
};

//3_FORGOT_PASSWORD CONTROLLER
exports.forgotPassword = async (req, res) => {
    try{
        const data = matchedData(req);
        const user = await User.phoneExists_verified(data.phone);
        const newPassword = await User.generateNewPassword();
        User.updatePassword(req, user, newPassword);
        sendVerificationCode(res, user.phone, newPassword);
        const response = user.forgotPassResponse();
        res.status(201).json(response);

    }catch (err) {
        handleError(res, buildErrObject(err.code, err.message));
    }
};