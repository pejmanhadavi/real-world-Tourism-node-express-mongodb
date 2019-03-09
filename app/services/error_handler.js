
//HANDLE ERROR
exports.handleError = (res, err)=>{
	//send errors to user
	res.status(err.code).json({
		success: false,
		message: err.message,
		data: null,
		time: new Date(Date.now()),
		code: err.code
	});
};

//BUILD ERROR
exports.buildErrObject = (code, message)=>{
	return{
		code,
		message
	};
};
