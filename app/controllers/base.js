const User = require('../models/user').User;
const bcrypt = require('bcrypt');
const request = require('request');
const config = require('config');
const dateFns = require('date-fns');

const MINUTES_TO_EXPIRE_VERIFICATION = 2;

exports.handleError = (res, err)=>{
    //send errors to user

        res.status(err.code).json({
            errors: {
                msg: err.message
            }
        });


    //errors in console
    console.log(err);


    
}

exports.buildErrObject = (code, message)=>{
    return{
        code, 
        message
    }
}

exports.usernameExists = async username =>{
    return new Promise((resolve, reject)=>{
        username = username.toLowerCase();
        User.findOne({
            username
        }, (err, result)=>{
            if(err){
                reject(this.buildErrObject(422, err.message));
            }
            if(result){
                reject(this.buildErrObject(422, 'USERNAME_ALREADY_EXISTS'));
            }
            resolve(false);
        });
    });
}

exports.phoneExists = async phone =>{
    return new Promise((resolve, reject)=>{
        User.findOne({
            phone
        }, (err, result)=>{
            if(err){
                reject(this.buildErrObject(422, err.message));
            }
            if(result){
                reject(this.buildErrObject(422, 'PHONE_ALREADY_EXISTS'));
            }
            resolve(false);
        });
    });
}



exports.sendVerificationCode = (res, user) => {
    expiresVerification(user);
    let propertiesObject = {
        from: config.get('PANEL_FROM'),
        to: user.phone,
        msg: config.get('PANEL_MESSAGE')+ user.verification,
        uname: config.get('PANEL_USERNAME'),
        pass: config.get('PANEL_PASS'),
    };

    request({url:config.get('PANEL_URI'), qs:propertiesObject}, function(err, response, body) {
        if(err) { this.handleError(res, this.buildErrObject(err.code, err.message)); return; }
        console.log("Get response sms panel: " + response.statusCode);
    });
}

const expiresVerification = async (user) => {
    return new Promise((resolve, reject) => {
        user.verificationExpires = dateFns.addMinutes(new Date, MINUTES_TO_EXPIRE_VERIFICATION);
        user.save()
            .then(result => resolve(result))
            .catch(err => reject(this.buildErrObject(err.code, err.message)));
    });
}