const matchedData = require('express-validator/filter').matchedData;

const {User, saveLoginAttemptsToDB} = require('../dao/user');
const PhoneStatus = require('../dao/phone_status').PhoneStatus;

const {buildErrObject, handleError} = require('../services/error_handler');
const {sendVerificationCode} = require('../services/send_sms');
const {UserAccess} = require('../dao/user_access');
const {isIDGood} = require('./base');


/**************************************
    * 1_REGISTER CONTROLLER *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.register = async(req, res) => {
    try{
        const data = matchedData(req);
        await User.deleteNotVerifiedUsers();

        await User.verificationSent(data.username, data.phone);


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
            User.expiresVerification(user);
            sendVerificationCode(res, user.phone, user.verification);
            res.status(201).json(userInfo);
        }
    }catch(err){
        handleError(res, buildErrObject(err.code, err.message));
    }
};

/************************************
    * VERIFY CONTROLLER *
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.verify = async (req, res) => {
    try{
        const data = matchedData(req);
        const id = await isIDGood(data.id);
        const user = await User.verificationExists(id);
        await PhoneStatus.deletePhoneStatus(user.phone);
        await User.verifyUser(data, res, user);
        res.status(200).json(await UserAccess.saveUserAccessAndReturnToken(req, user));
    }catch (err) {
        handleError(res, buildErrObject(err.code, err.message));
    }
};

/*****************************************
   * FORGOT_PASSWORD CONTROLLER *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.forgotPassword = async (req, res) => {
    try{
        const data = matchedData(req);
        const user = await User.phoneExists(data.phone);
        const newPassword = await User.generateNewPassword();
        User.updatePassword(req, user, newPassword);
        sendVerificationCode(res, user.phone, newPassword);
        const response = user.forgotPassResponse();
        res.status(201).json(response);
    }catch (err) {
        handleError(res, buildErrObject(err.code, err.message));
    }
};

/*********************************************
   * LOGIN CONTROLLER *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
    try {
        const data = matchedData(req);
        const user = await User.phoneExists(data.phone);
        await User.userIsBlocked(user);
        await User.checkLoginAttemptsAndBlockExpires(user);
        const isPasswordMatch =await User.checkPassword(data.password, user);
        if (!isPasswordMatch){
            await User.passwordsDoNotMatch(user);
        }else {
            user.loginAttempts = 0;
            await saveLoginAttemptsToDB(user);
            res.status(200).json(await UserAccess.saveUserAccessAndReturnToken(req, user));
        }
    }catch (err) {
        handleError(res, buildErrObject(err.code, err.message));
    }
};