const mongoose = require('mongoose');
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
      timestamps: true
    }
  );
  facilitySchema.index({
    name: 'text'
  });
  facilitySchema.plugin(mongoosePaginate);
  

//EXPORT SCHEMA
module.exports.facilitySchema = facilitySchema;