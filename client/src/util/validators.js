const Joi = require('@hapi/joi');

exports.validateSignIn = (email, password) => {
    const signInJoi = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[0-9])")).min(5).required()
    });
    return signInJoi.validate({ email, password });
}

exports.validateSignUp = (username, email, password, confirmP) => {
    const signUpJoi = Joi.object({
        username: Joi.string().min(3).max(15).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[0-9])")).min(5).required(),
        confirmP: Joi.ref('password')
    });
    return signUpJoi.validate({ username, email, password, confirmP });
}

exports.isEmpty = (obj) => Object.entries(obj).length === 0;