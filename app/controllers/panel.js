const {rememberMe} = require('../../init/passport-local');

exports.getLogin = async (req, res, next) => {
    try{
        res.render('panel/login');
    }catch(err){
        next(err);
    }
};


exports.postLogin = (req, res, next) => {
    try {
        rememberMe(req);
        req.flash('success', 'You are now logged in');
        res.redirect('/panel/dashboard');
    }catch (err) {
        next(err);
    }
};


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
            totalcommentsReviews:150});
    }catch (err) {
        next(err);
    }
};
