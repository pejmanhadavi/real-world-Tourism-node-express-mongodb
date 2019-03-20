const mongoose = require('mongoose');

const {experienceSchema} = require('../schemas/experience');
const {buildErrObject} = require('../services/error_handler');




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
					reject(buildErrObject(404, 'NOT_FOUND'));

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

//CHECK THE EXPERIENCES
//CHECK IF THE TOUR LEADER HAS THE EXPERIENCES
experienceSchema.statics.checkTheExperiences =  experiences => {
	return new Promise((resolve, reject) => {
		Experience.find()
			.then(result => {
				if (!result)
					reject(buildErrObject(409, 'NO_EXPERIENCE'));
				const arrayOfIds = pushIdsInArray(result);
				for(let i in experiences){
					if (arrayOfIds.indexOf(experiences[i])<0)
						reject(buildErrObject(400, 'BAD_REQUEST'))
				}
				resolve(true);
			})
			.catch(err => reject(buildErrObject(422, err.message)));
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
/**************************
 * CREATE AND EXPORT MODEL
 **************************/
const Experience = mongoose.model('Experience', experienceSchema);
exports.Experience = Experience;