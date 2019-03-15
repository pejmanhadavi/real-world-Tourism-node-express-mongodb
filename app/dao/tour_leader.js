const mongoose = require('mongoose');

const {tourLeaderSchema} = require('../schemas/tour_leader');
const {buildErrObject}= require('../services/error_handler');


/*************************
 * STATICS
 *************************/
//USER EXISTS
tourLeaderSchema.statics.tourLeaderExists= id => {
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
tourLeaderSchema.statics.tourLeaderDoesNotExists= id=>{
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

//CHECK TOUR LEADER AND VALIDATION
tourLeaderSchema.statics.tourLeaderCheckForRequest = id => {
	return new Promise((resolve, reject) => {
		TourLeader.findOne({
			_id: id,
			verified: true
		})
			.then(result => {
				if(!result)
					reject(buildErrObject(404, 'TOUR_lEADER_NOT_FOUND_OR_NOT_VERIFIED'));
				resolve(true);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//GET TOUR LEADER USER ID
tourLeaderSchema.statics.getTourLeaderUserId = id => {
	return new Promise((resolve, reject) => {
		TourLeader.findOne({
			_id: id,
			verified: true
		})
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				resolve(result.user);
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
				if (req.body.experiences) {
					result.experiences = req.body.experiences;
					await result.save();
				}
				resolve({
					id: result._id
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
				});
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//GET TOUR LEADER ID
tourLeaderSchema.statics.getTourLeaderId = userId => {
	return new Promise((resolve, reject) => {
		TourLeader.findOne({
			user: userId,
			verified: true
		})
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				resolve(result._id);
			})
			.catch(err => reject(buildErrObject(422,err.message)));
	});
};

//GET TOUR LEADER COST PER DAY
tourLeaderSchema.statics.getTourLeaderCostPerDay = id => {
	return new Promise((resolve, reject) => {
		TourLeader.findById(id)
			.then(result => {
				if (!result)
					reject(buildErrObject(404, 'NOT_FOUND'));
				resolve(result.costPerDay);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};


/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const TourLeader = mongoose.model('TourLeader', tourLeaderSchema);
exports.TourLeader = TourLeader;