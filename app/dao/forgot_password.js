const mongoose = require('mongoose');
const forgotPasswordSchema = require('../schemas/forgot_password').forgotPasswordSchema;

//CREATE MODEL
const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);