"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = __importStar(require("jsonwebtoken"));
var Logger_1 = __importDefault(require("../utilities/Logger"));
var jwtSecret = process.env.JWT_SECRET || '';
function requireAuth(req, res, next) {
    if (!req.headers || !req.headers.authorization) {
        Logger_1.default.info('Failed authorization due to no header');
        return res.status(401).send({
            success: false,
            error: {
                code: 401,
                message: 'No authorization headers.'
            },
            payload: null
        });
    }
    var token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
        Logger_1.default.info('Failed authorization due to malformed token');
        return res.status(401).send({
            success: false,
            error: {
                code: 401,
                message: 'Malformed Token.'
            },
            payload: null
        });
    }
    var token = token_bearer[1];
    return jwt.verify(token, jwtSecret, function (err) {
        if (err) {
            Logger_1.default.info('Failed authorization due to incorrect token');
            return res.status(500).send({
                success: false,
                error: {
                    code: 500,
                    message: 'Failed to authenticate.'
                },
                payload: null
            });
        }
        return next();
    });
}
exports.requireAuth = requireAuth;
