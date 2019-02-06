
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

//MESSAGE SCHEMA
const messageSchema = new Schema({
	participants: {
		type:  [{
			ObjectId,
			ref: 'User'
		}],
		validate: [(val)=>{
			return val.length>1 && val.length<3;
		}, 'MOST_BE_2_PARTICIPANTS']
	},
	body: {
		type: String,
		required: true,
		maxlength: 500,
	},
	author: {
		type: ObjectId,
		ref: 'User'
	}
},
{
	timestamps: true
});

//EXPORT SCHEMA
module.exports.messageSchema = messageSchema;

  