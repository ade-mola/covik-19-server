"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
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
    return jwt.verify(token, jwtSecret || 'covidrandomsecret', function (err) {
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
