const config = require('config');
const request = require('request');
const {handleError, buildErrObject} = require('./error_handler');




exports.sendVerificationCode = (res, phone, verification) => {
    let propertiesObject = {
        from: config.get('PANEL_FROM'),
        to: phone,
        msg: config.get('PANEL_MESSAGE')+verification,
        uname: config.get('PANEL_USERNAME'),
        pass: config.get('PANEL_PASS'),
    };

    //DISABLE SMS AND JUST SHOW IT IN CONSOLE
    console.log('VERIFICATION_CODE: '+verification);

    // request({url:config.get('PANEL_URI'), qs:propertiesObject}, function(err, response, body) {
    //     if(err) { handleError(res, buildErrObject(err.code, err.message)); return; }
    //     console.log("SMS_PANEL_RESPONSE: " + response.statusCode);
    // });
};
