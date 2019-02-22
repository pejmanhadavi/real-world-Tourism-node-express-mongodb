const {isIDGood} = require('./base');
const {buildErrObject, handleError} = require('../services/error_handler');

const {Message} = require('../dao/message');
const {TourLeader} = require('../dao/tour_leader');