require('dotenv-safe').config();
const {handleError, buildErrObject} = require('./app/services/error_handler');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const initMongo = require('./init/mongo');
const config = require('config');


//INIT MONGO
initMongo();

// app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// use middleware
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


require('./init/routes')(app);
require('./init/production')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(buildErrObject(404, 'NOT_FOUND'));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	// res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	handleError(res, buildErrObject(err.code, err.message));

});

module.exports = app;
