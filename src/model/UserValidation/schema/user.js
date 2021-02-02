const joi = require('joi');

module.exports.registerUserSchema = () => {
    return joi.object().keys({
        first_name: joi.string().required(),
        last_name: joi.string().required(),
        password: joi.string().min(8).required(),
        email_id: joi.string().regex(/[a-zA-Z0-9\.]+@[a-zA-Z0-9\.]+/i).required(),
        org_name: joi.string().required()
    }).options({ allowUnknown: false });
}

module.exports.loginSchema = () => {
    return joi.object().keys({
        email_id: joi.string().regex(/[a-zA-Z0-9\.]+@[a-zA-Z0-9\.]+/i).required(),
        password: joi.string().required()
    }).options({ allowUnknown: false });
}

module.exports.getUserListSchema = () => {
    return joi.object().keys({
        search_text: joi.string().allow("", null),
        sort_by: joi.array().items(joi.string().valid("first_name", "last_name", "emp_id", "org_name")).min(1).required(),
        page_no: joi.number().min(1).required(),
        records_per_page: joi.number().min(1).required()
    }).options({ allowUnknown: false });
}

module.exports.defaultSchema = () => {
    return joi.object().keys({

    }).options({ allowUnknown: true });
}