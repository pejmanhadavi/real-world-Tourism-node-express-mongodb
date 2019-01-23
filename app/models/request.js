const mongoose =  require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

//request schema
const requestSchema = new Schema({
    from: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    maxHourOccupancy: {
        type:Number,
        required: true
    },
    Verification: {
        type: boolean,
        default: false,
    },
    description: {
        type: string,
        maxlength: 500
    }
}, {
    timestamps: true
});

//request model
const Request = mongoose.model('Request', requestSchema);

//export request model
module.exports = Request;