const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');

const {Request} = require('../dao/request');



exports.sendRequest = async (req, res) => {
  try {
      //check user
      //check tour leader
      //save properties
      //fuck user

  }catch (err) {
      handleError(res, buildErrObject(err.code, err.message));
  }
};