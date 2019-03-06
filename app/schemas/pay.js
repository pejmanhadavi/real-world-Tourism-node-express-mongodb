const mongoose =  require('mongoose');
const Schema = mongoose.Schema;



const paySchema = new Schema({
	factorNumber: {
		type: String,
		required: true
	},
	transactionId: {
		type: Number,
		required: true
	},
	amount: {
		type: String,
		required: true
	},
	cardNumber: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});


exports.paySchema = paySchema;