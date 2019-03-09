
//HANDLE RESPONSE
exports.handleResponse = (res, status, message, data)=>{
    res.status(status).json({
        success: true,
        message: message,
        data: data,
        time: new Date(Date.now()),
        code: status
    });
};