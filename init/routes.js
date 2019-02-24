const express = require('express');
const indexRouter = require('../app/routes/index');
const usersRouter = require('../app/routes/users');
const authRouter = require('../app/routes/auth');
const profileRouter = require('../app/routes/profile');
const tourLeaderRouter = require('../app/routes/tour_leader');
const requestRoute = require('../app/routes/request');
const messageRoute = require('../app/routes/message');


module.exports = app => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/auth', authRouter);
    app.use('/profile', profileRouter);
    app.use('/tourLeader', tourLeaderRouter);
    app.use('/request', requestRoute);
    app.use('/message', messageRoute);
};