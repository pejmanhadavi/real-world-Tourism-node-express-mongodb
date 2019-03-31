const express = require('express');
// const {refreshToken} = require('../app/services/refresh_token_middleware');
const cors = require('cors');
const passport = require('passport');
const indexRouter = require('../app/routes/index');
const usersRouter = require('../app/routes/users');
const authRouter = require('../app/routes/auth');
const profileRouter = require('../app/routes/profile');
const tourLeaderRouter = require('../app/routes/tour_leader');
const requestRoute = require('../app/routes/request');
const rateRoute = require('../app/routes/rate');
const payRoute = require('../app/routes/pay');
const panelRoute = require('../app/routes/panel');


module.exports = app => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(require('cookie-parser')());
    app.use(require('express-session')({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(refreshToken);
    app.set('view engine', 'ejs');

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/auth', authRouter);
    app.use('/profile', profileRouter);
    app.use('/tourLeader', tourLeaderRouter);
    app.use('/request', requestRoute);
    app.use('/rate', rateRoute);
    app.use('/pay', payRoute);
    app.use('/panel', panelRoute);
};
