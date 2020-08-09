"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultSchema = exports.clusterSchema = exports.NewClusterSchema = exports.EmailSchema = exports.TokenSchema = exports.ExistingUserSchema = exports.NewUserSchema = void 0;
var celebrate_1 = require("celebrate");
exports.NewUserSchema = celebrate_1.Joi.object().keys({
    email: celebrate_1.Joi.string().required().email(),
    password: celebrate_1.Joi.string().min(5).max(255).required(),
    notification_token: celebrate_1.Joi.string(),
});
exports.ExistingUserSchema = celebrate_1.Joi.object().keys({
    email: celebrate_1.Joi.string().required().email(),
    password: celebrate_1.Joi.string().min(5).max(255).required(),
    notification_token: celebrate_1.Joi.string(),
});
exports.TokenSchema = { token: celebrate_1.Joi.string().token().required() };
exports.EmailSchema = { email: celebrate_1.Joi.string().email().required() };
exports.NewClusterSchema = celebrate_1.Joi.object().keys({
    userId: celebrate_1.Joi.string().required(),
    time: celebrate_1.Joi.string().required(),
    location: celebrate_1.Joi.string().required().regex(/-?\d+\.?\d*\:{1}-?\d+\.?\d*/)
});
exports.clusterSchema = celebrate_1.Joi.array().items(exports.NewClusterSchema);
exports.TestResultSchema = celebrate_1.Joi.object().keys({
    userId: celebrate_1.Joi.string().required(),
    checkInTime: celebrate_1.Joi.string().required(),
    isPositive: celebrate_1.Joi.boolean().required()
});
