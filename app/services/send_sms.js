
const request = require('request');
const {handleError, buildErrObject} = require('./error_handler');




exports.sendVerificationCode = (res, phone, verification) => {
    let propertiesObject = {
        from: process.env.PANEL_FROM,
        to: phone,
        msg: process.env.PANEL_MESSAGE+verification,
        uname: process.env.PANEL_USERNAME,
        pass: process.env.PANEL_PASS,
    };

    //DISABLE SMS AND JUST SHOW IT IN CONSOLE
    console.log('VERIFICATION_CODE: '+verification);

    // request({url:process.env.PANEL_URI, qs:propertiesObject}, function(err, response, body) {
    //     if(err) { handleError(res, buildErrObject(err.code, err.message)); return; }
    //     console.log("SMS_PANEL_RESPONSE: " + response.statusCode);
    // });
};
