"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author EDC: Oluwatobi Adeoye. <oluwatobiadeoye18@gmail.com>
*/
var mongoose_1 = __importStar(require("mongoose"));
var tokenSchema = new mongoose_1.default.Schema({
    _userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});
module.exports = mongoose_1.default.model("Token", tokenSchema);
