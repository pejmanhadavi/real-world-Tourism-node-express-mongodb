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
//SEND REQUEST
router.post('/', requireAuth, validate.sendRequest, controller.sendRequest);

router.get('/tourLeaderFirstValidate/:requestId', validate.tourLeaderFirstValidate, controller.tourLeaderFirstValidate);

// router.post('/tourLeaderFinalValidate', validate.tourLeaderFinalValidate, controller.tourLeaderFinalValidate);
//
// router.post('/userFinalValidate', validate.userFinalValidate, controller.userFinalValidate);
//
// router.post('/pay', validate.pay, controller.pay);


module.exports = router;



