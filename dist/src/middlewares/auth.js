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
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    var token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
        Logger_1.default.info('Failed authorization due to malformed token');
        return res.status(401).send({ message: 'Malformed token.' });
    }
    var token = token_bearer[1];
    return jwt.verify(token, jwtSecret, function (err) {
        if (err) {
            Logger_1.default.info('Failed authorization due to incorrect token');
            return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
        }
        return next();
    });
}
exports.requireAuth = requireAuth;
