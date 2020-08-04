"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Super_1 = __importDefault(require("./Super"));
var UserModel = __importStar(require("../models/User"));
var Response_1 = __importDefault(require("../utilities/Response"));
var UserController = /** @class */ (function (_super) {
    __extends(UserController, _super);
    function UserController() {
        var _this = _super.call(this) || this;
        _this.model = UserModel;
        return _this;
    }
    UserController.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.createRecord(__assign({}, data))];
                    case 1:
                        record = _a.sent();
                        if (record && record._id)
                            return [2 /*return*/, Response_1.default.processSuccessfulResponse(__assign({}, record))];
                        return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Could not create resource')];
                }
            });
        });
    };
    UserController.prototype.readOne = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.readRecord(__assign({}, options))];
                    case 1:
                        records = _a.sent();
                        if (records[0])
                            return [2 /*return*/, Response_1.default.processSuccessfulResponse(__assign({}, records[0]))];
                        return [2 /*return*/, Response_1.default.processFailedResponse(404, 'Resource not found')];
                }
            });
        });
    };
    UserController.prototype.readMany = function (options, page, population) {
        return __awaiter(this, void 0, void 0, function () {
            var pagination, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pagination = this.determinePagination(page, population);
                        return [4 /*yield*/, this.model.readRecord(__assign({}, options), pagination)];
                    case 1:
                        records = _a.sent();
                        if (records.length)
                            return [2 /*return*/, Response_1.default.processSuccessfulResponse(records.slice())];
                        return [2 /*return*/, Response_1.default.processFailedResponse(404, 'Resource not found')];
                }
            });
        });
    };
    UserController.prototype.update = function (options, data) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.updateRecord(__assign({}, options), __assign({}, data))];
                    case 1:
                        result = _a.sent();
                        if (result && result.nModified)
                            return [2 /*return*/, Response_1.default.processSuccessfulResponse(__assign({}, options, data))];
                        if (result && !result.nModified)
                            return [2 /*return*/, Response_1.default.processFailedResponse(406, 'No Change.')];
                        return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Resource not modified')];
                }
            });
        });
    };
    UserController.prototype.delete = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.model.deleteRecord(__assign({}, options))];
                    case 1:
                        result = _a.sent();
                        if (result && result.nModified)
                            return [2 /*return*/, Response_1.default.processSuccessfulResponse({})];
                        return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Resource not modified')];
                }
            });
        });
    };
    return UserController;
}(Super_1.default));
exports.default = new UserController;
