let err=()=>{};

err.throwErr = (message, statusCode)=>{
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}

err.defaultErr = (error) =>{
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    return error;
}

export default err;