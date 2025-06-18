export const success = (message = "Success", data = {})=>{
    return {success: true, message: message, data : data};

}

export const failure = (message = "Something Went Wrong")=>{
    return {success: false, message: message};
}