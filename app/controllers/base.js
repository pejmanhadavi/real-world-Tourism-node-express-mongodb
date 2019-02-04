const {buildErrObject} = require('../services/error_handler');

exports.isIDGood = async id => {
    return new Promise((resolve, reject) => {
        const goodID = String(id).match(/^[0-9a-fA-F]{24}$/);
        console.log("ID: "+goodID);
        return goodID
            ? resolve(id)
            : reject(buildErrObject(422, 'ID_MALFORMED'));
    });
};