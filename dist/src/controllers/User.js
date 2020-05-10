"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
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
const Super_1 = __importDefault(require("./Super"));
const UserModel = __importStar(require("../models/User"));
const Response_1 = __importDefault(require("../utilities/Response"));
class UserController extends Super_1.default {
    constructor() {
        super();
        this.model = UserModel;
    }
    async create(data) {
        const record = await this.model.createRecord(Object.assign({}, data));
        if (record && record._id)
            return Response_1.default.processSuccessfulResponse(Object.assign({}, record));
        return Response_1.default.processFailedResponse(400, 'Could not create resource');
    }
    async readOne(options) {
        const records = await this.model.readRecord(Object.assign({}, options));
        if (records[0])
            return Response_1.default.processSuccessfulResponse(Object.assign({}, records[0]));
        return Response_1.default.processFailedResponse(404, 'Resource not found');
    }
    async readMany(options, page, population) {
        const pagination = this.determinePagination(page, population);
        const records = await this.model.readRecord(Object.assign({}, options), pagination);
        if (records.length)
            return Response_1.default.processSuccessfulResponse([...records]);
        return Response_1.default.processFailedResponse(404, 'Resource not found');
    }
    async update(options, data) {
        const result = await this.model.updateRecord(Object.assign({}, options), Object.assign({}, data));
        if (result && result.nModified)
            return Response_1.default.processSuccessfulResponse(Object.assign(Object.assign({}, options), data));
        if (result && !result.nModified)
            return Response_1.default.processFailedResponse(406, 'No Change.');
        return Response_1.default.processFailedResponse(400, 'Resource not modified');
    }
    async delete(options) {
        const result = await this.model.deleteRecord(Object.assign({}, options));
        if (result && result.nModified)
            return Response_1.default.processSuccessfulResponse({});
        return Response_1.default.processFailedResponse(400, 'Resource not modified');
    }
}
exports.default = new UserController;
//# sourceMappingURL=User.js.map