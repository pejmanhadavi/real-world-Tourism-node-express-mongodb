const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


//province schema
const provinceSchema = new Schema(
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
  )
  provinceSchema.index({
    name: 'text'
  })

//city schema
const citySchema = new Schema(
  {

    province: {
        type: ObjectId,
        required: true,
    },
    name: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
citySchema.index({
  name: 'text'
});

//pagination
provinceSchema.plugin(mongoosePaginate);
citySchema.plugin(mongoosePaginate);

//province and city model
const City = mongoose.model('City', citySchema);
const Province = mongoose.model('Province', provinceSchema);

//export city and province model
module.exports.City = City;
module.exports.Province = Province;


