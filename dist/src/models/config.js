"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
class CovikDatabase {
    constructor(mongoose) {
        const { NODE_ENV, MONGO_URI, MONGOLAB_URI, MONGOHQ_URI, MONGO_LOCAL } = process.env;
        this.mongoose = mongoose;
        this.database = NODE_ENV === 'production' ? MONGO_URI || MONGOLAB_URI || MONGOHQ_URI || '' : MONGO_LOCAL || '';
        this.connect();
    }
    connect() {
        this.mongoose.connect(this.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 10
        });
    }
}
exports.default = new CovikDatabase(mongoose_1.default);
//# sourceMappingURL=config.js.map