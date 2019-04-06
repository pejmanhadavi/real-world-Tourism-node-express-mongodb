const {rememberMe} = require('../../init/passport-local');
/*********************************
 * Get login controller
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getLogin = async (req, res, next) => {
    try{
        res.render('panel/login');
    }catch(err){
        next(err);
    }
};

/******************************
 * POST login controller
 * @param req
 * @param res
 * @param next
 */
exports.postLogin = (req, res, next) => {
    try {
        rememberMe(req);
        req.flash('success', 'You are now logged in');
        res.redirect('/panel/dashboard');
    }catch (err) {
        next(err);
    }
};

/*************************************
 * GET dashboard controller
 * @param req
 * @param res
 * @param next
 */
exports.dashboard = (req, res, next) => {
    try {
        res.render('panel/dashboard', {
            registeredUsers: 12,
            registeredLeaders:32,
            totalPayment:12000,
            totalReserved:100,
            totalLeadersReviews:30,
            totalExperiencesReviews:50,
            totalComments:90,
            totalCommentsReviews:150});
    }catch (err) {
        next(err);
    }
};
