"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
/** ROUTE FILES */
var Users_1 = __importDefault(require("./Users"));
var cluster_1 = __importDefault(require("./cluster"));
/** CONFIG */
var router = express_1.default.Router();
router.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        req.headers["access-control-allow-origin"] = '*';
        req.headers["access-control-allow-headers"] = '*';
        if (req.method === 'OPTIONS') {
            req.headers["access-control-allow-methods"] = 'GET, POST, PUT, PATCH, DELETE';
            res.status(200).json();
        }
        next();
        return [2 /*return*/];
    });
}); });
/** */
router.use('/users', Users_1.default);
router.use('/clusters', cluster_1.default);
/** STATIC HANDLERS */
router.use('/images/image/:image_uri', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.sendFile(path_1.default.resolve(__dirname, "../../public/images/" + req.params.image_uri));
        return [2 /*return*/];
    });
}); });
/**  EXCEPTIONS */
router.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var error;
    return __generator(this, function (_a) {
        error = {
            status: 404,
            message: 'Resource not found'
        };
        next(error);
        return [2 /*return*/];
    });
}); });
router.use(function (error, req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, res.status(error.status || 500).send({
                success: false,
                error: {
                    code: error.status || 500,
                    message: error.message || 'Internal Server error'
                },
                payload: null
            })];
    });
}); });
module.exports = router;
