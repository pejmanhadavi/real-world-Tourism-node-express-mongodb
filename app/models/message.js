const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

//message schema
const messageSchema = new Schema({
    participants: {
        type:  [{
        ObjectId,
        ref: 'User'
      }],
      validate: [(val)=>{
        return val.length>1 && val.length<3;
      }, 'Sould be 2 participants']
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
  
  //message model
  const Message = mongoose.model('Message', messageSchema);

  //export message model
  module.exports = Message;

  