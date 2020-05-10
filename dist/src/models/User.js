"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ModelHelper_1 = require("./ModelHelper");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    unique_key: {
        type: String,
        required: false
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false
    }
});
const User = exports = mongoose_1.default.model('User', UserSchema);
exports.createRecord = async (data) => {
    const new_record = new User(Object.assign({}, data));
    return await new_record.save();
};
exports.readRecord = async (options, pagination) => {
    return await User.find(Object.assign(Object.assign({}, ModelHelper_1.processAlternatives(options)), { is_active: true }), null, pagination);
};
exports.updateRecord = async (options, data) => {
    return await User.update(Object.assign(Object.assign({}, ModelHelper_1.processAlternatives(options)), { is_active: true }), Object.assign({}, data));
};
exports.deleteRecord = async (options) => {
    return await User.update(Object.assign(Object.assign({}, ModelHelper_1.processAlternatives(options)), { is_active: true }), {
        is_active: false,
        is_deleted: true
    });
};
//# sourceMappingURL=User.js.map