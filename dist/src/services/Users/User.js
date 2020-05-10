"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = __importDefault(require("../../utilities/Response"));
// Write Heavy Logic in services
class UserService {
    constructor() { }
    async sampleRequestHandler(request) {
        try {
            return Response_1.default.processFailedResponse(404, 'Resource Not Found');
        }
        catch (e) {
            console.log(`[UserService] inHouseMethod Error: ${e.message}`);
        }
    }
}
exports.default = UserService; // or new UserService
//# sourceMappingURL=User.js.map