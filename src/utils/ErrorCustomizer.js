
module.exports.JoiCustomErrors = (JoiErrorArray) => {
    let ErrorArray = [];
    for (let i = 0; i < JoiErrorArray.length; i++) {
        let CorresParam = JoiErrorArray[i].context.key;
        let ErrType = (JoiErrorArray[i].type) ? JoiErrorArray[i].type.substring(JoiErrorArray[i].type.indexOf(".") + 1, JoiErrorArray[i].type.length).toLowerCase() : "";
        switch (ErrType) {
            case "required":
                ErrorArray.push('Error: ' + "Please enter " + CorresParam + "\n");
                break;
            case "empty":
                ErrorArray.push('Error: ' + "Please enter " + CorresParam + "\n");
                break;
            case "base":
                ErrorArray.push('Error: ' + `Please enter permissible value of ${CorresParam}\n`);
                break;
            // case "max":
            //     ErrorArray.push('Error: ' + `Please enter permissible value of ${CorresParam}\n`);
            //     break;
            // case "min":
            //     ErrorArray.push('Error: ' + `Please enter permissible value of ${CorresParam}\n`);
            //     break;
            case "email":
                ErrorArray.push('Error: ' + "Please enter permissible value of email\n");
                break;
            case "allowonly":
                let valids = JoiErrorArray[i].context.valids.join('/ ');
                ErrorArray.push(`Error: Value of ${CorresParam} has to be one of (${valids}).\n`);
                break;
            default:
                ErrorArray.push(JoiErrorArray[i].message + "\n");
                break;
        }
    }
    return ErrorArray;
}

module.exports.jsonschemaCustomErrors = (errorsArray, objectName) => {
    let ErrorArray = [];
    let objname = (objectName) ? objectName : "";
    for (let i = 0; i < errorsArray.length; i++) {
        ErrorArray.push(`Error in ${objname}: ${errorsArray[i].stack}`);
    }
    return ErrorArray;
}

module.exports.BadURLError = (errorCategory) => {
    let error = new Error();
    error.statusCode = 400;
    switch (errorCategory) {
        case 'url':
            error.data = "Requested API url is invalid."
            break;
        case 'falsewsdlurl':
            error.data = "Requested soap API wsdl url is invalid."
            break;
        case 'falserequestservicesoap':
            error.data = "Either Requested service does not exist in provided wsdl url or arguements sent to service are invalid."
            break;
        default:
            error.data = "Requested API url is invalid."
            break;
    }
    throw error;
}

module.exports.badRequestError = (msg) => {
    let err = new Error();
    err.statusCode = 400;
    err.data = msg;
    throw err;
}

