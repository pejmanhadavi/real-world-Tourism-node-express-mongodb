const User = require('../models/user').User;
const bcrypt = require('bcrypt');

exports.handleError = (res, err)=>{
    //send errors to user
    res.status(err.code).json({
        errors: {
            msg: err.message
        }
    });

    // errors in console
    // console.log(err);
    
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