const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


//PROVINCE SCHEMA
const provinceSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		}
	},
	{
		versionKey: false,
		timestamps: false
	}
);
provinceSchema.index({
	name: 'text'
});

//CITY SCHEMA
const citySchema = new Schema(
	{

		province: {
			type: ObjectId,
			ref: 'CITY',
			required: true,
		},
		name: {
			type: String,
			required: true
		}
	},
	{
		versionKey: false,
		timestamps: false
	}
);
citySchema.index({
	name: 'text'
});

//PAGINATE
provinceSchema.plugin(mongoosePaginate);
citySchema.plugin(mongoosePaginate);

//EXPORT SCHEMAS
module.exports.citySchema = citySchema;
module.exports.provinceSchema = provinceSchema;


