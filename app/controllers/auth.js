const matchedData = require('express-validator/filter').matchedData;
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/user').User;
const mongoose = require('mongoose');

const usernameExists = require('./base').usernameExists;
const buildErrObject = require('./base').buildErrObject;
const handleError = require('./base').handleError;
const genSalt =


exports.register = async(req, res) => {
    try{
        req = matchedData(req);
        const doesUsernameExists =await usernameExists(req.username);
        if(!doesUsernameExists){
            const result = await registerUser(req);
            const userInfo = setUserInfo(result);
            const response = returnRegistrationToken(result, userInfo);
            // sendRegistrationSmsMessage(result);
            res.status(201).json(response);
        }
    }catch(err){
        handleError(res, err);
        // console.log(err);
    }
}



const registerUser = async req => {
    return new Promise(async (resolve, reject) => {
        const user = new User({
            username: req.username,
            password: req.password,
            phone: req.phone,
            phoneVerification: 'verification'
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