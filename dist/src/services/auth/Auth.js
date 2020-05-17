"use strict";
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
var crypto_1 = require("crypto");
var Mailer_1 = require("../Mailer");
var Logger_1 = __importDefault(require("../../utilities/Logger"));
var jwt = __importStar(require("jsonwebtoken"));
var bcrypt = __importStar(require("bcrypt"));
var uuid = __importStar(require("uuid"));
var Token = require('../../models/Token');
var UserModel = require('../../models/User');
var jwtSecret = process.env.JWT_SECRET || '';
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.prototype.signUp = function (userInputDTO) {
        return __awaiter(this, void 0, void 0, function () {
            var email, existingUser, password_hash, newUser, userRecord, token, user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        email = userInputDTO.email;
                        return [4 /*yield*/, UserModel.readRecord({ email: email })];
                    case 1:
                        existingUser = _a.sent();
                        Logger_1.default.info("Attempting to signup user with email: " + email);
                        if (existingUser.length > 0) {
                            Logger_1.default.info("User with email " + email + " already exists");
                            throw new Error('User already exists');
                        }
                        return [4 /*yield*/, this.generatePassword(userInputDTO.password)];
                    case 2:
                        password_hash = _a.sent();
                        newUser = {
                            email: userInputDTO.email,
                            password: password_hash,
                            unique_key: uuid.v4()
                        };
                        return [4 /*yield*/, UserModel.createRecord(newUser)];
                    case 3:
                        userRecord = _a.sent();
                        Logger_1.default.info("User details persisted. Generating verfication token");
                        token = this.generateJWT(userRecord);
                        if (!userRecord) {
                            Logger_1.default.error("Something unexpected went wrong during signup");
                            throw new Error('User cannot be created');
                        }
                        return [4 /*yield*/, this.generateAndSendVerificationToken(userRecord)];
                    case 4:
                        _a.sent();
                        user = userRecord.toObject();
                        Reflect.deleteProperty(user, 'password');
                        Reflect.deleteProperty(user, '_id');
                        Reflect.deleteProperty(user, '__v');
                        Logger_1.default.info("Sign up complete. User's id is " + user.unique_key);
                        return [2 /*return*/, { user: user, token: token }];
                    case 5:
                        error_1 = _a.sent();
                        error_1.status = 401;
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.verify = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var savedToken, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info("Verifying token: " + token);
                        return [4 /*yield*/, Token.findOne({ token: token })];
                    case 1:
                        savedToken = _a.sent();
                        if (!savedToken) {
                            Logger_1.default.info("Unrecognised token: " + token);
                            return [2 /*return*/, "User Not Verified" /* NotVerified */];
                        }
                        return [4 /*yield*/, UserModel.readRecord({ _id: savedToken._userId })];
                    case 2:
                        user = _a.sent();
                        if (user.length < 1) {
                            Logger_1.default.info("Cannot find any user associated with token: " + token);
                            return [2 /*return*/, "User not found" /* UserNotFound */];
                        }
                        user = user[0];
                        Logger_1.default.info("Verifying user with id: " + user.unique_key);
                        if (user.isVerified) {
                            Logger_1.default.info('User already verfied');
                            return [2 /*return*/, "User already verified" /* AlreadyVerified */];
                        }
                        Logger_1.default.info('Updating user\'s verfification status to verrified');
                        //could not make to use updateRecord method in UserModel. could not figure why it was throwing error:
                        //fromObject toObject is not a function
                        return [4 /*yield*/, user.updateOne({ isVerified: true })];
                    case 3:
                        //could not make to use updateRecord method in UserModel. could not figure why it was throwing error:
                        //fromObject toObject is not a function
                        _a.sent();
                        Logger_1.default.info('Verification completed');
                        return [2 /*return*/, "User successfully verified" /* Verifed */];
                }
            });
        });
    };
    AuthService.prototype.login = function (userInputDTO) {
        return __awaiter(this, void 0, void 0, function () {
            var email, usersFound, userRecord, validPassword, token, user, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        email = userInputDTO.email;
                        Logger_1.default.info("Attempting login for user with email: " + email);
                        return [4 /*yield*/, UserModel.readRecord({ email: email })];
                    case 1:
                        usersFound = _a.sent();
                        if (usersFound.length < 1) {
                            Logger_1.default.info("There is no account associated with email " + email);
                            throw new Error('User does not exist');
                        }
                        userRecord = usersFound[0];
                        return [4 /*yield*/, this.comparePasswords(userInputDTO.password, userRecord.password)];
                    case 2:
                        validPassword = _a.sent();
                        if (!validPassword) {
                            Logger_1.default.info('Could not proceed with login due to invalid credentials');
                            throw new Error('Invalid Login credentials');
                        }
                        if (!userRecord.isVerified) {
                            Logger_1.default.info('Aborting login as user is yet to be verified');
                            throw new Error('Aborting login. User is yet to be verified');
                        }
                        token = this.generateJWT(userRecord);
                        user = userRecord.toObject();
                        Reflect.deleteProperty(user, 'passwrord');
                        Logger_1.default.info('Login completed');
                        return [2 /*return*/, { user: user, token: token }];
                    case 3:
                        error_2 = _a.sent();
                        Logger_1.default.error('Something went wrong during log in', error_2);
                        error_2.status = 401;
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.generatePassword = function (plainTextPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.genSalt(10)];
                    case 1:
                        salt = _a.sent();
                        return [4 /*yield*/, bcrypt.hash(plainTextPassword, salt)];
                    case 2:
                        hash = _a.sent();
                        return [2 /*return*/, hash];
                }
            });
        });
    };
    AuthService.prototype.comparePasswords = function (plainTextPassword, hash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.compare(plainTextPassword, hash)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthService.prototype.generateAndSendVerificationToken = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var token, host, email;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1.default.info("Generating verification token for user with id " + user.unique_key);
                        token = new Token({
                            _userId: user._id,
                            token: crypto_1.randomBytes(16).toString('hex')
                        });
                        token.save();
                        Logger_1.default.info("Successfully generated token. Sending token to user's email " + user.email);
                        host = process.env.HOST || "http://localhost:" + process.env.APP_PORT;
                        email = {
                            to: user.email,
                            from: "oaadeoye14@student.lautech.edu.ng",
                            subject: "Email Verification",
                            text: "Some uselss text",
                            html: "<p>Please verify your account by clicking the link: \n            <a href=\"" + host + "/users/auth/verify?token=" + token.token + "\">" + host + "/users/auth/verify?token=" + token.token + "</a> </p>"
                        };
                        return [4 /*yield*/, Mailer_1.sendEmail(email)];
                    case 1:
                        _a.sent();
                        Logger_1.default.info('Verfication token sent!!');
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.generateJWT = function (user) {
        Logger_1.default.info("Generating jwt token for user id: " + user.unique_key);
        return jwt.sign(user.toJSON(), jwtSecret);
    };
    return AuthService;
}());
exports.default = new AuthService;
