"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var celebrate_1 = require("celebrate");
exports.UserSchema = celebrate_1.Joi.object().keys({
    email: celebrate_1.Joi.string().min(5).max(255).required().email(),
    password: celebrate_1.Joi.string().min(5).max(255).required()
});
exports.TokenSchema = { token: celebrate_1.Joi.string().token().required() };
