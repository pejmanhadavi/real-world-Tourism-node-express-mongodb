const {generateToken, decrypt} = require('./auth');
const JWT = require('jsonwebtoken');
const {buildErrObject} = require('./error_handler');
const {UserRefresh} = require('../dao/user_refresh');




/****************************
 * GENERATE ACCESS TOKEN
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.refreshToken = async (req, res, next) => {
    try{
        const token =  req.header('x-token');
        const refreshToken = req.header('x-refresh-token');
        if (refreshToken && token){
            const decodedToken = JWT.decode(decrypt(token));
            if (refreshToken && token && decodedToken.exp < Date.now()/1000)
            {
                const userId = await UserRefresh.findRefreshAndReturnUserId(refreshToken);
                const response = {
                    token: generateToken(userId),
                };
                req.headers['Access-Control-Expose-Headers'] = 'x-token, x-refresh-token';
                req.headers['x-refresh-token'] = refreshToken;
                req.headers['x-token'] = response.token;


                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-refresh_token', refreshToken);
                res.set('x-token', response.token);
            }
        }
    }catch (err) {
        next(buildErrObject(400, err.message));
    }
    next();
};
