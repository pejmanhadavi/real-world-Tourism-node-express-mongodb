exports.handleError = (res, err)=>{
    //send errors to user
    res.status(err.code).json({
        errors: {
            msg: err.message
        }
    });
    
}

exports.buildErrObject = (code, message)=>{
    return{
        code, 
        message
    }
}