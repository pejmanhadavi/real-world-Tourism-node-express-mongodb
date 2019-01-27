const mongoose = require('mongoose');
const dateFns = require('date-fns');
const userSchema = require('../schemas/user').userSchema;
const MINUTES_TO_EXPIRE_VERIFICATION = 2;


//CREATE MODEL
const User = mongoose.model('User', userSchema);

/*
STATICS
 */
userSchema.statics.usernameExists = async username =>{
    return new Promise((resolve, reject)=>{
        username = username.toLowerCase();
        User.findOne({
            username
        })
            .then(result => {
                if (result === null)
                    resolve(false);

                reject(this.buildErrObject(422, 'USERNAME_ALREADY_EXISTS'));
            })
            .catch(err => reject(this.buildErrObject(422, err.message)));
    });
};


userSchema.methods.phoneExists= async phone =>{
    return new Promise((resolve, reject)=>{
        User.findOne({
            phone
        })
            .then(result => {
                if (result === null)
                    resolve(false);

                reject(this.buildErrObject(422, 'PHONE_ALREADY_EXISTS'));
            })
            .catch(err => reject(this.buildErrObject(422, err.message)));
    });
};


userSchema.statics.forgotPhoneExists = async phone =>{
    return new Promise((resolve, reject)=>{
        User.findOne({
            phone
        })
            .then(result => {
                console.log('result '+result);
                if (result !== null)
                    resolve(true);

                resolve(false);
            })
            .catch(err => reject(this.buildErrObject(422, err.message)));
    });
}




/*
METHODS
 */

userSchema.methods.comparePassword = function(passwordAttempt, cb) {
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
        err ? cb(err) : cb(null, isMatch)
    );
};

userSchema.methods.genSalt = async function() {
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
};

userSchema.methods.expiresVerification = async () => {
    return new Promise((resolve, reject) => {
        this.verificationExpires = dateFns.addMinutes(new Date, MINUTES_TO_EXPIRE_VERIFICATION);
        this.save()
            .then(result => resolve(result))
            .catch(err => reject(this.buildErrObject(err.code, err.message)));
    });
};




/*
HELPERS
 */
const hash = (user, salt, next) => {
    bcrypt.hash(user.password, salt, null, (err, newHash) => {
        if(err)
            return next(err);
        user.password = newHash;

        return next();
    })
}



