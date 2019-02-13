const mongoose = require('mongoose');
const dateFns = require('date-fns');
const bcrypt = require('bcrypt');
const uuid = require('uuid');




const userSchema = require('../schemas/user').userSchema;
const {buildErrObject}= require('../services/error_handler');
const {generateToken} = require('../services/auth');

const LOGIN_ATTEMPTS = 5;
const HOURS_TO_BLOCK = 2;






/*************************
 * STATICS *
 ************************/

//CHECK PHONE_FORGOT
userSchema.statics.emailExists= async email=>{
	return new Promise((resolve, reject)=>{
		User.findOne({
			email
		})
			.then(result => {
				if (!result)
					resolve(result);
				reject(buildErrObject(422, 'EMAIL_ALREADY_EXISTS'));
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//REGISTER
userSchema.statics.registerUser = async data => {
	return new Promise(async (resolve, reject) => {
		const user = new User({
			name: data.name,
			password: data.password,
			email: data.email,
			verification: uuid.v4()
		});

		await user.genSalt();
		user.save()
			.then(result => resolve(result))
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//SET USER INFO
userSchema.statics.setUserInfo = data => {
	const user = {
		_id: data._id,
		name: data.name,
		email: data.email,
		verified: data.verified
	};
	return user;
};

//CHECK EMAIL VERIFICATION EXISTS
userSchema.statics.verificationExists = async verification => {
	return new Promise((resolve, reject) => {
		User.findOne(
			{
				verification,
				verified: false
			})
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND_OR_ALREADY_VERIFIED'));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


//VERIFY USER
userSchema.statics.verifyUser = async user => {
	return new Promise((resolve, reject) => {
		user.verified = true;
		user.save()
			.then(result => {
				const response = {
					email: result.email,
					verified: result.verified
				};
				resolve(response);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//FIND USER BY EMAIL
userSchema.statics.findUserByEmail = async email => {
	return new Promise((resolve, reject) => {
		User.findOne(
			{
				email,
				verified: true
			},
			'password loginAttempts blockExpires name email role verified',)
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'USER_DOES_NOT_EXISTS_OR_NOT_VERIFIED'));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


//UPDATE NEW PASSWORD
userSchema.statics.updatePassword = async (user, newPassword) => {
	return new Promise(async (resolve, reject) => {
		const salt = await bcrypt.genSalt(10);
		let hashPassword = await bcrypt.hash(newPassword, salt);

		await user.update({
			password: hashPassword
		})
			.then(result => resolve(result))
			.catch(err => reject(buildErrObject(422, err.message)));

	});
};


//CHECK LOGIN ATTEMTPS AND BLOCK EXPIRES
userSchema.statics.checkLoginAttemptsAndBlockExpires = async user => {
	return new Promise((resolve, reject) => {
		if(blockIsExpired(user)){
			user.loginAttempts = 0;
			user.save()
				.then(result => resolve(result))
				.catch(err => reject(buildErrObject(422, err.message)));
		}else{
			resolve(true);
		}
	});
};


//PASSWORDS DO NOT MATCH
userSchema.statics.passwordsDoNotMatch = async user => {
	user.loginAttempts += 1;
	await this.saveLoginAttemptsToDB(user);
	return new Promise(async (resolve, reject) => {
		if (user.loginAttempts <= LOGIN_ATTEMPTS) {
			reject(buildErrObject(409, 'WRONG_PASSWORD'));
		} else {
			reject(await blockUser(user));
		}
		reject(buildErrObject(422, 'ERROR'));
	});
};

//CHECK PASSWORD
userSchema.statics.checkPassword = async (password, user) => {
	return new Promise((resolve, reject) => {
		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) {
				reject(buildErrObject(422, err.message));
			}
			if (!isMatch) {
				resolve(false);
			}
			resolve(true);
		});
	});
};

//COMPARE PASSWORD
userSchema.statics.comparePassword = (passwordAttempt, password, cb) => {
	bcrypt.compare(passwordAttempt, password, (err, isMatch) =>
		err ? cb(err) : cb(null, isMatch)
	);
};

//USER IS BLOCKED
userSchema.statics.userIsBlocked = async user => {
	return new Promise((resolve, reject) => {
		if(user.blockExpires > new Date())
			reject(buildErrObject(409, 'BLOCKED_USER'));
		resolve(true);
	});
};


//GET PROFILE FROM DB
userSchema.statics.getProfileFromDB = async id => {
	return new Promise((resolve, reject) => {
		User.findById(id, '-_id -updatedAt -createdAt -loginAttempts -verified -blockExpires -verification -password')
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


//UPDATE PROFILE IN DB
userSchema.statics.updateProfileInDB = async (req, id) => {
	return new Promise((resolve, reject) => {
		delete req.body._id;
		delete req.body.email;
		User.findById(id)
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				// Assigns new values to user
				for (const property in req.body) {
					result[property] = req.body[property];
				}
				if(req.body.newPassword){
					if (req.body.currentPassword){
						const isPassMatch = await User.checkPassword(req.body.currentPassword, result);
						if (isPassMatch)
							await User.updatePassword(result, req.body.newPassword);
						else
							reject(buildErrObject(409, 'WRONG_CURRENT_PASSWORD'));
					}else
						reject(buildErrObject(409, 'WRONG_CURRENT_PASSWORD'));
				}
				if (req.files.profile){
					result.profileImages.push(req.files.profile[0].filename);
				}
				if (req.files.backgroundImage){
					result.backgroundImage = req.files.backgroundImage[0].filename;
				}
				await result.save();

				const userObject = result.toObject();
				delete userObject._id;
				delete userObject.updatedAt;
				delete userObject.createdAt;
				delete userObject.password;
				delete userObject.blockExpires;
				delete userObject.verification;
				delete userObject.verified;



				resolve(userObject);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


//DELETE PROFILE IMAGE
userSchema.statics.deleteProfileImage = (id, profileImage) => {
	return new Promise((resolve, reject) => {
		User.findByIdAndUpdate(id, {$pull:{profileImages: profileImage}})
			.then(resolve)
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


//DELETE BACKGROUND IMAGE
userSchema.statics.deleteBackgroundImage = (id) => {
	return new Promise((resolve, reject) => {
		User.findByIdAndUpdate(id, {$unset:{backgroundImage: undefined}})
			.then(resolve)
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

/************************
 * METHODS *
 ***********************/
//GEN SALT
userSchema.methods.genSalt = async function() {
	const salt = await bcrypt.genSalt(10);
	this.password= await bcrypt.hash(this.password, salt);
};



//RETURN REGISTRATION TOKEN
userSchema.methods.returnRegistrationToken = (user, userInfo) => {
	return {
		token: generateToken(user._id),
		user: userInfo
	};
};

//FORGOT PASS RESPONSE
userSchema.methods.forgotPassResponse = () => {
	return {
		phone: this.phone,
		message: 'NEW_PASSWORD_SENT'
	};
};








/********************************
 * HELPERS *
 ********************************/

//BLOCK IS EXPIRED
const blockIsExpired = (user) =>
	user.loginAttempts > LOGIN_ATTEMPTS && user.blockExpires <= new Date();


//BLOCK USER
const blockUser = async user => {
	return new Promise((resolve, reject) => {
		user.blockExpires = dateFns.addHours(new Date(), HOURS_TO_BLOCK);
		user.save()
			.then(() => reject(buildErrObject(409, 'BLOCKED_USER')))
			.catch(err => reject(buildErrObject(422, err.message)));

	});
};

//SAVE LOGIN ATTEMPTS
exports.saveLoginAttemptsToDB = async user => {
	return new Promise((resolve, reject) => {
		user.save()
			.then(result => resolve(result))
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};
/**************************************
 * CREATE AND EXPORT MODEL*
***************************************/
const User = mongoose.model('User', userSchema);
exports.User = User;