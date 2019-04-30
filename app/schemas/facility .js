const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

//FACILITY SCHEMA
const facilitySchema = new Schema(
	{
		name: {
			type: String,
			required: true
		}
	},
	{
		versionKey: false,
	}
);
facilitySchema.index({
	name: 'text'
});
facilitySchema.plugin(mongoosePaginate);


//EXPORT SCHEMA
exports.facilitySchema = facilitySchema;
exports.Facility = mongoose.model('Facility', facilitySchema);
