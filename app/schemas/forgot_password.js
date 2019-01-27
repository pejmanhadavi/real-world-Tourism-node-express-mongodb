const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//FORGOT_PASSWORD SCHEMA
const forgotPasswordSchema = new Schema(
    {
        phone: {
            type: String,
            lowercase: true,
            required: [true, 'PHONE_IS_BLANK'],
        },
        verification: {
            type: String
        },
        verificationExpires: {
            type: Date
        },
        used: {
            type: Boolean,
            default: false
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

forgotPasswordSchema.index({
    phone: 'text',
    verificationKey: 'text'
});

//EXPORT SCHEMA
module.exports.forgotPasswordSchema = forgotPasswordSchema;
