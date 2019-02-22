const {check, param, validationResult} = require('express-validator/check');
const {buildErrObject, handleError} = require('../services/error_handler');