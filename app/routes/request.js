const express = require('express');
const router = express.Router();
require('../../init/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {
	session: false
});
const validate = require('../validations/request');
const controller = require('../controllers/request');


/*
ROUTES
 */
router.post('/', requireAuth, validate.sendRequest, controller.sendRequest);

router.get('/tourLeaderFirstValidate/:requestId', requireAuth, validate.tourLeaderValidate, controller.tourLeaderFirstValidate);

router.get('/tourLeaderFinalValidate/:requestId', requireAuth, validate.tourLeaderValidate, controller.tourLeaderFinalValidate);

router.get('/userFinalValidate/:requestId', requireAuth, validate.tourLeaderValidate, controller.userFinalValidate);

router.post('/userSatisfaction/:requestId', requireAuth, validate.satisfaction, controller.userSatisfaction);

router.post('/tourLeaderSatisfaction/:requestId', requireAuth, validate.satisfaction, controller.tourLeaderSatisfaction);

module.exports = router;



