"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Super_1 = __importDefault(require("./Super"));
var Auth_1 = __importDefault(require("../services/auth/Auth"));
var Response_1 = __importDefault(require("../utilities/Response"));
var AuthController = /** @class */ (function (_super) {
    __extends(AuthController, _super);
    function AuthController() {
        var _this = _super.call(this) || this;
        _this.authService = Auth_1.default;
        return _this;
    }
    AuthController.prototype.signUp = function (userInputDTO) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.signUp(userInputDTO)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, Response_1.default.processFailedResponse(409, "User with email " + userInputDTO.email + " already exists")];
                        return [2 /*return*/, Response_1.default.processSuccessfulResponse(__assign({}, user))];
                }
            });
        });
    };
    AuthController.prototype.login = function (userInputDTO) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.login(userInputDTO)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, Response_1.default.processFailedResponse(401, 'Invalid login credentials or user has not been verified')];
                        return [2 /*return*/, Response_1.default.processSuccessfulResponse(__assign({}, user))];
                }
            });
        });
    };
    AuthController.prototype.verifyUser = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.verify(token)];
                    case 1:
                        status = _a.sent();
                        switch (status) {
                            case "User already verified" /* AlreadyVerified */:
                                return [2 /*return*/, Response_1.default.processFailedResponse(400, status.valueOf())];
                            case "User Not Verified" /* NotVerified */:
                                return [2 /*return*/, Response_1.default.processFailedResponse(400, 'User not verified. Incorrect or Expired Token!!')];
                            case "User not found" /* UserNotFound */:
                                return [2 /*return*/, Response_1.default.processFailedResponse(401, 'No user associated with the provided token')];
                            default:
                                return [2 /*return*/, Response_1.default.processSuccessfulResponse(status.valueOf())];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.resendToken = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var sent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.resendToken(email)];
                    case 1:
                        sent = _a.sent();
                        if (!sent) {
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'The associated account has already been verfied.please log in')];
                        }
                        return [2 /*return*/, Response_1.default.processSuccessfulResponse("Verification token has been sent to " + email)];
                }
            });
        });
    };
    return AuthController;
}(Super_1.default));
exports.default = new AuthController;
