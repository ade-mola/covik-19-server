"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var mongoose_1 = __importDefault(require("mongoose"));
var Logger_1 = __importDefault(require("../utilities/Logger"));
dotenv_1.default.config();
var CovikDatabase = /** @class */ (function () {
    function CovikDatabase(mongoose) {
        var _a = process.env, NODE_ENV = _a.NODE_ENV, MONGO_URI = _a.MONGO_URI, MONGOLAB_URI = _a.MONGOLAB_URI, MONGOHQ_URI = _a.MONGOHQ_URI, MONGO_LOCAL = _a.MONGO_LOCAL;
        this.mongoose = mongoose;
        this.database = NODE_ENV === 'production' ? MONGO_URI || MONGOLAB_URI || MONGOHQ_URI || '' : MONGO_LOCAL || '';
        this.connect();
    }
    CovikDatabase.prototype.connect = function () {
        var _this = this;
        this.mongoose.connect(this.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 10
        }).then(function () { return Logger_1.default.info("Connected to " + _this.database + "..."); });
    };
    return CovikDatabase;
}());
exports.default = new CovikDatabase(mongoose_1.default);
