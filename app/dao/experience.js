const mongoose = require('mongoose');

const {experienceSchema} = require('../schemas/experience');
const {buildErrObject} = require('../services/error_handler');
const {experience_dao} = require('../../messages');



/*********************
 * STATICS
 ********************/

//CALCULATE AMOUNT OF REQUEST
// experienceSchema.statics.calculateAmount  = experiences => {
// 	return new Promise((resolve, reject) => {
// 		let amount = 0;
// 		for (let i in experiences){
// 			Experience.findById(experiences[i])
// 				.then(result => {
// 					if (!result)
// 						reject(buildErrObject(404, 'NOT_FOUND'));
// 					amount += result.cost;
// 				})
// 				.catch(err => reject(buildErrObject(422, err.code)));
// 		}
// 		console.log(amount);
// 		resolve(amount);
// 	});
// };

experienceSchema.statics.calculateAmount  = experiences => {
	return new Promise((resolve, reject) => {
		let amount = 0 ;
		Experience.find()
			.then(result => {
				if (!result)
					reject(buildErrObject(404, experience_dao.NO_EXPERIENCE));

				const idArr = pushIdsInArray(result);
				const amountArr = pushAmountsInArray(result);
				console.log(experiences[0].toString());
				for ( let i = 0 ; i < experiences.length ; i ++) {
					amount += amountArr[idArr.indexOf(experiences[i].toString())];
				}
				resolve(amount);
			})
			.catch(err => buildErrObject(422, err.message));
	});
};


//CHECK IF THE TOUR LEADER HAS THE EXPERIENCES
experienceSchema.statics.checkTheExperiences =  experiences => {
	return new Promise((resolve, reject) => {
		Experience.find()
			.then(result => {
				if (!result)
					reject(buildErrObject(409, experience_dao.NO_EXPERIENCE));
				const arrayOfIds = pushIdsInArray(result);
				for(let i in experiences){
					if (arrayOfIds.indexOf(experiences[i])<0)
						reject(buildErrObject(400, experience_dao.BAD_REQUEST))
				}
				resolve(true);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
	});
};

//GET PROFILE AND COST OF EXPERIENCES
// experienceSchema.statics.getProfileAndCostOfExperiences = experiences => {
// 	return new Promise((resolve, reject) => {
// 		let array = [];
// 		console.log(experiences);
// 		for (let i =0 ; i < experiences.length ; i++ ){
// 			Experience.findById(experiences[i])
// 				.then(result => {
// 					if(!result)
// 						reject(buildErrObject(400, 'BAD_REQ'));
// 					array.push({
// 						id: result._id,
// 						title: result.title,
// 						profile: result.profile,
// 					});
// 					console.log(array);
// 				})
// 				.catch(err => reject(buildErrObject(422, err.message)));
// 			resolve(array);
// 		}
// 	});
// };

experienceSchema.statics.getProfileAndCostOfExperiences = experiences => {
	return new Promise((resolve, reject) => {
		Experience.find()
			.then(result => {
				if (!result)
					reject(buildErrObject(404, experience_dao.NO_EXPERIENCE));
				const items = getIdProfileTitle(result, experiences);
				resolve(items);
			})
			.catch(err => buildErrObject(422, err.message));
	});
};

/**************************
 * HELPERS
 *************************/
const pushIdsInArray = json => {
	let array = [];
	for (let i in json){
		array.push(json[i]._id.toString());
	}
	return array;
};

const pushAmountsInArray = json => {
	let array = [];
	for (let i in json){
		array.push(json[i].cost);
	}
	return array;
};

const getIdProfileTitle = (json, experiences) => {
	let arrayOFExperiencesProperties = [];

	const ids = json.map(a => a._id.toString());
	const profiles = json.map(a => a.profile);
	const titles = json.map(a => a.title);

	let exProperty = {} ;

	experiences.forEach(item => {
		let index = ids.indexOf(item.toString());
		if ( index < 0 )
			return (buildErrObject(400, experience_dao.BAD_REQUEST));
		exProperty.id = item;
		exProperty.title = titles[index];
		exProperty.profile = profiles[index];

		arrayOFExperiencesProperties.push(exProperty);
		exProperty = {};
	});

	console.log(arrayOFExperiencesProperties);
	return arrayOFExperiencesProperties;
};
/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Experience = mongoose.model('Experience', experienceSchema);
exports.Experience = Experience;
