const mongoose = require('mongoose');

const {tourLeaderSchema} = require('../schemas/tour_leader');
const {buildErrObject}= require('../services/error_handler');


/*************************
 * STATICS
 *************************/

//USER EXISTS
tourLeaderSchema.statics.userExists= id=>{
	return new Promise((resolve, reject)=>{
		TourLeader.findOne({
			user: id
		})
			.then(result => {
				if (!result)
					resolve(true);
				reject(buildErrObject(422, 'USER_ALREADY_EXISTS'));
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//USER DOES NOT EXITS
tourLeaderSchema.statics.userDoesNotExists= id=>{
	return new Promise((resolve, reject)=>{
		TourLeader.findOne({
			user: id
		})
			.then(result => {
				if (!result)
					reject(buildErrObject(422, 'USER_IS_NOT_TOUR_LEADER'));
				resolve(true);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//EDIT
tourLeaderSchema.statics.edit = (req, id) => {
	return new Promise((resolve, reject) => {

		if (!req.body.costPerDay && !req.body.costPerHalfDay)
			reject(buildErrObject(422,'BAD_REQUEST'));



		TourLeader.findOne({
			user: id
		})
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, 'USER_NOT_FOUND'));
				if (req.body.costPerDay) {
					result.costPerDay = req.body.costPerDay;
				}
				if (req.body.costPerHalfDay) {
					result.costPerHalfDay = req.body.costPerHalfDay;
				}
				await result.save();

				resolve({
					msg: 'UPDATED'
				});
			})
			.catch(err =>
				reject(buildErrObject(422, err.message)));
	});
};


//REGISTER TOUR LEADER
tourLeaderSchema.statics.registerTourLeader = (req, id) => {
	return new Promise((resolve, reject) => {
		const tourLeader = new TourLeader({
			user: id,
			costPerDay: req.body.costPerDay,
			costPerHalfDay: req.body.costPerHalfDay,
		});
		if (req.files){
			if (req.files.scanTourLeaderCertification)
				tourLeader.scanTourLeaderCertification = req.files.scanTourLeaderCertification[0].filename;
			if (req.files.scanBirthCertification)
				tourLeader.scanBirthCertification = req.files.scanBirthCertification[0].filename;
		}
		tourLeader.save()
			.then(result => {
				resolve({
					id: result._id,
					msg: 'TOUR_LEADER_REGISTERED_WAITE_UNTIL_VERIFY'
				});
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const TourLeader = mongoose.model('TourLeader', tourLeaderSchema);
exports.TourLeader = TourLeader;