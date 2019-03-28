const mongoose = require('mongoose');

const {tourLeaderSchema} = require('../schemas/tour_leader');
const {buildErrObject}= require('../services/error_handler');
const {leader_dao} = require('../../messages');

/*************************
 * STATICS
 *************************/
//USER EXISTS
tourLeaderSchema.statics.tourLeaderExists= id => {
	return new Promise((resolve, reject)=>{
		TourLeader.findOne({
			user: id,
			verified: true,
		})
			.then(result => {
				if (!result)
					resolve(true);
				reject(buildErrObject(422, leader_dao.LEADER_ALREADY_EXISTS));
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
					reject(buildErrObject(404, leader_dao.USER_IS_NOT_TOUR_LEADER));
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
					reject(buildErrObject(404, leader_dao.TOUR_LEADER_NOT_FOUND_OR_NOT_VERIFIED));
				resolve(true);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//GET TOUR LEADER USER ID
tourLeaderSchema.statics.getTourLeaderById = id => {
	return new Promise((resolve, reject) => {
		TourLeader.findOne({
			_id: id,
			verified: true
		})
			.then(result => {
				if (!result)
					reject(buildErrObject(404, leader_dao.LEADER_NOT_FOUND));
				resolve(result);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//CHECK IF THE TOUR LEADER HAS THE EXPERIENCES
tourLeaderSchema.statics.checkTheExperiences = (id, experiences )=> {
	return new Promise((resolve, reject) => {
		TourLeader.findById(id)
			.then(result => {
				if (!result)
					reject(buildErrObject(404, leader_dao.LEADER_NOT_FOUND));
				for(let i in experiences){
				    if (result.experiences.indexOf(experiences[i]) < 0)
				        reject(buildErrObject(400, leader_dao.BAD_REQUEST));
				}
				resolve(true);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//EDIT
tourLeaderSchema.statics.edit = (req, id) => {
	return new Promise((resolve, reject) => {
		if (!req.body.experiences)
			reject(buildErrObject(400,leader_dao.BAD_REQUEST));
		TourLeader.findOne({
			user: id,
			verified: true,
		})
			.then(async result => {
				if (!result)
					reject(buildErrObject(404, leader_dao.LEADER_NOT_FOUND));
				result.experiences = req.body.experiences;
				await result.save();
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
			if (req.files.scanTourLeaderCertification && req.files.scanBirthCertification){

				tourLeader.scanTourLeaderCertification = req.files.scanTourLeaderCertification[0].filename;
				tourLeader.scanBirthCertification = req.files.scanBirthCertification[0].filename;
			}else {
				reject(buildErrObject(409, leader_dao.SEND_SCAN_BIRTH_AND_LEADER_CARDS));
			}
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
					reject(buildErrObject(404, leader_dao.LEADER_NOT_FOUND));
				resolve(result._id);
			})
			.catch(err => reject(buildErrObject(422,err.message)));
	});
};

//GET LEADER BY EXPERIENCE
tourLeaderSchema.statics.getLeaderByExperience = id => {
	return new Promise((resolve, reject) => {
		TourLeader.find({verified: true, experiences: {$elemMatch: id}}, '_id user name profileImages')
			.then(result => {
				if (!result)
					reject(buildErrObject(404, leader_dao.LEADER_NOT_FOUND));
				resolve(result);
			})
			.catch(err => buildErrObject(422, 'ERROR'));
	});
};


/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const TourLeader = mongoose.model('TourLeader', tourLeaderSchema);
exports.TourLeader = TourLeader;
