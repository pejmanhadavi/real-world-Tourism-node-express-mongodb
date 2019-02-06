
//HADNLE ERROR
exports.handleError = (res, err)=>{
	//send errors to user
	res.status(err.code).json({
		errors: {
			msg: err.message
		}
	});

	//errors in console
	console.log(err);
};

//BUILD ERROR
exports.buildErrObject = (code, message)=>{
	return{
		code,
		message
	};
};
