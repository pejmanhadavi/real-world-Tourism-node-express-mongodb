const User = require('../models/user').User;

exports.handleError = (res, err)=>{
    //send errors to user
    // res.status(err.code).json({
    //     errors: {
    //         msg: err.message
    //     }
    // });

    // errors in console
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

exports.encrypt = async text =>{

}