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

        console.log('PHONE STATUS: '+phoneStatus);
        if (phoneStatus){
            await PhoneStatus.phoneIsBlocked(phoneStatus);
            await PhoneStatus.checkRegisterAttemptsAndBlockExpires(phoneStatus);
            await PhoneStatus.incrementAttemps(phoneStatus);
            await PhoneStatus.blockPhone(phoneStatus);
        }
        else if (!phoneStatus && !doesPhoneExists){
            await PhoneStatus.registerPhone(data.phone);
        }



        
        
        //REGISTER
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
        //VERIFY
        const data = matchedData(req);
        const user = await User.verificationExists(data.id);
        if(!user){
            handleError(res, buildErrObject(422, 'NOT_USER_OR_ALREADY_REGISTERED'));
            return;
        }
        
        //DELETE PHONE STATUS
        res.status(200).json(await User.verifyUser(data, res, user));
    }catch (err) {
        handleError(res, buildErrObject(422, err.message));
    }
};

//3_FORGOT_PASSWORD CONTROLLER
exports.forgotPassword = async (req, res) => {
    try{
        const data = matchedData(req);
        const user = await User.phoneExists_verified(data.phone);
        if (!user){
            handleError(res, buildErrObject(404, 'PHONE_NOT_FOUND_OR_NOT_VERIFIED'));
            return;
        }
        const newPassword = await User.generateNewPassword();
        User.updatePassword(req, user, newPassword);
        sendVerificationCode(res, user.phone, newPassword);
        const response = user.forgotPassResponse();
        res.status(201).json(response);

    }catch (err) {
        handleError(res, buildErrObject(422, err.message));
    }
};