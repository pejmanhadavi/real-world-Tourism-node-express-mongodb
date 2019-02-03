const requestIp = require('request-ip');

exports.getIP = req => requestIp.getClientIp(req);

exports.getBrowserInfo = req => req.header['user-agent'] || '!';

exports.getCountry = req => req.headers['cf-ipcountry'] ? req.headers['cf-ipcountry'] : 'XX';