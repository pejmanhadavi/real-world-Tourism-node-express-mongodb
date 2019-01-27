const mongoose = require('mongoose');
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
      timestamps: true
    }
  )
  provinceSchema.index({
    name: 'text'
  })

//CITY SCHEMA
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

//PAGINATE
provinceSchema.plugin(mongoosePaginate);
citySchema.plugin(mongoosePaginate);

//EXPORT SCHEMAS
module.exports.citySchema = citySchema;
module.exports.provinceSchema = provinceSchema;

