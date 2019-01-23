const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//facility schema
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
  


//facility model
const Facility = mongoose.model('Facility' , facilitySchema);

//export facility model
module.exports = Facility;